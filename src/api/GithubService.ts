// @ts-nocheck
import { FormatEnum, type Granularity } from '~/types';
import _ from 'lodash';
import { request, gql } from 'graphql-request';
import { COLOR_MAP } from '~/constants';

const GITHUB_GRAPHQL_API = 'https://api.github.com/graphql';

class GithubService {
  private username: string = '';
  private repoName: string = '';
  private format: string = FormatEnum.flat;
  private token: string = import.meta.env.VITE_GITHUB_TOKEN;

  private async fetchYears(): Promise<{ href: string; text: string }[]> {
    const query = gql`
      query($username: String!) {
        user(login: $username) {
          contributionsCollection {
            contributionYears
          }
        }
      }
    `;

    const variables = {
      username: this.username,
    };

    const response = await request(GITHUB_GRAPHQL_API, query, variables, {
      Authorization: `Bearer ${this.token}`,
    });

    return response.user.contributionsCollection.contributionYears.map((year) => ({
      href: `/users/${this.username}/contributions?from=${year}-01-01&to=${year}-12-31`,
      text: year.toString(),
    }));
  }

  private async fetchDataForYear(url: string, year: string): Promise<YearData> {
    const query = gql`
      query($username: String!, $from: DateTime!, $to: DateTime!) {
        user(login: $username) {
          contributionsCollection(from: $from, to: $to) {
            contributionCalendar {
              totalContributions
              weeks {
                contributionDays {
                  date
                  contributionCount
                }
              }
            }
          }
        }
      }
    `;

    const [from, to] = url.split('?from=')[1].split('&to=').map((date) => new Date(date).toISOString());

    const variables = {
      username: this.username,
      from,
      to,
    };

    const response = await request(GITHUB_GRAPHQL_API, query, variables, {
      Authorization: `Bearer ${this.token}`,
    });

    const calendar = response.user.contributionsCollection.contributionCalendar;
    const $days = calendar.weeks.flatMap((week) => week.contributionDays);

    return {
      year,
      total: calendar.totalContributions,
      range: {
        start: $days[0]?.date,
        end: $days[$days.length - 1]?.date,
      },
      contributions: (() => {
        const parseDay = (day) => {
          const date = day.date.split('-').map((d) => parseInt(d, 10));
          const intensity = Math.min(Math.floor(day.contributionCount, 10), 4); // Determine intensity based on contribution count
          const color = COLOR_MAP[intensity];
          const value = {
            date: day.date,
            count: day.contributionCount,
            color,
            intensity,
          };
          return { date, value };
        };

        if (this.format !== FormatEnum.nested) {
          return $days.map(parseDay).map((day) => day.value);
        }

        return $days.reduce((o, day) => {
          const { date, value } = parseDay(day);
          const [y, m, d] = date;
          if (!o[y]) o[y] = {};
          if (!o[y][m]) o[y][m] = {};
          o[y][m][d] = value;
          return o;
        }, {});
      })(),
    };
  }

  public async fetchDataForAllYears(): Promise<UserContributions> {
    const years = await this.fetchYears();
    if (years.length === 0) {
      throw new Error('No years found for the user.');
    }

    return Promise.all(
      years.map((year) => this.fetchDataForYear(year.href, year.text)),
    ).then((resp) => {
      return {
        years: (() => {
          const obj = {};
          const arr = resp.map((year) => {
            const { contributions, ...rest } = year;
            _.setWith(obj, [rest.year], rest, Object);
            return rest;
          });
          return this.format === FormatEnum.nested ? obj : arr;
        })(),
        contributions:
          this.format === FormatEnum.nested
            ? resp.reduce((acc, curr) => _.merge(acc, curr.contributions), {})
            : resp
              .reduce((list, curr) => [...list, ...curr.contributions], [])
              .sort((a, b) => {
                if (a.date < b.date) return 1;
                else if (a.date > b.date) return -1;
                return 0;
              }),
      };
    });
  }

  private async fetchCodeChangesForRepo() {
    const query = gql`
      query($username: String!, $repoName: String!) {
        repository(owner: $username, name: $repoName) {
          defaultBranchRef {
            target {
              ... on Commit {
                history(first: 100) {
                  edges {
                    node {
                      additions
                      committedDate
                    }
                  }
                }
              }
            }
          }
        }
      }
    `;

    const variables = {
      username: this.username,
      repoName: this.repoName,
    };

    const response = await request(GITHUB_GRAPHQL_API, query, variables, {
      Authorization: `Bearer ${this.token}`,
    });

    const history = response.repository.defaultBranchRef.target.history.edges;

    return history.map((commit) => ({
      date: new Date(commit.node.committedDate).toISOString().split('T')[0],
      additions: commit.node.additions,
    }));
  }

  public async getCodeRetentionData(granularity: Granularity) {
    const codeChanges = await this.fetchCodeChangesForRepo();
    const groupedData = {};

    codeChanges.forEach((change) => {
      let key;
      const date = new Date(change.date);
      switch (granularity) {
        case 'week':
          const week = `${date.getFullYear()}-W${Math.ceil(date.getDate() / 7)}`;
          key = week;
          break;
        case 'month':
          key = change.date.slice(0, 7); // YYYY-MM
          break;
        case 'year':
          key = change.date.slice(0, 4); // YYYY
          break;
        default:
          key = change.date;
      }

      if (!groupedData[key]) {
        groupedData[key] = { additions: 0, retained: [] };
      }

      groupedData[key].additions += change.additions;
      groupedData[key].retained.push(change.additions);
    });

    const retentionData = [];

    Object.keys(groupedData).forEach((key, index) => {
      const data = {
        name: key,
        data: Array(Object.keys(groupedData).length).fill(0),
      };

      Object.keys(groupedData).forEach((innerKey, innerIndex) => {
        if (innerIndex >= index) {
          data.data[innerIndex] = groupedData[innerKey].retained.slice(0, index + 1).reduce((a, b) => a + b, 0);
        }
      });

      retentionData.push(data);
    });

    return retentionData;
  }

  public setUserName = (username: string) => {
    this.username = username;
  };
  public setRepoName = (repoName: string) => {
    this.repoName = repoName;
  };
  public setGranularity = (granularity: string) => {
    this.granularity = granularity;
  }
  public setFormat = (format: FormatEnum) => {
    this.format = format;
  };
}

// Singleton instance
let githubServiceInstance: GithubService | null = null;

export function getGithubService(): GithubService {
  if (!githubServiceInstance) {
    githubServiceInstance = new GithubService();
  }
  return githubServiceInstance;
}

export default getGithubService();
