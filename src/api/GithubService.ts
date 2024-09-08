// @ts-nocheck
import * as cheerio from "cheerio";
import { COLOR_MAP } from "../constants";
import _ from "lodash";
import { FormatEnum, type UserContributions, type YearData } from "~/types";

class GithubService {
  private username: string = "";
  private format: string = FormatEnum.flat;

  private async fetchYears(): Promise<{ href: string; text: string }[]> {
    const data = await fetch(`https://github.com/${this.username}?tab=contributions`, {
      headers: {
        "x-requested-with": "XMLHttpRequest"
      }
    });
    const body = await data.text();
    const $ = cheerio.load(body);
    return $(".js-year-link")
      .get()
      .map((a) => {
        const $a = $(a);
        const href = $a.attr("href");
        const githubUrl = new URL(`https://github.com${href}`);
        githubUrl.searchParams.set("tab", "contributions");
        const formattedHref = `${githubUrl.pathname}${githubUrl.search}`;

        return {
          href: formattedHref,
          text: $a.text().trim()
        };
      });
  }

  private async fetchDataForYear(url: string, year: string): Promise<YearData> {
    const data = await fetch(`https://github.com${url}`, {
      headers: {
        "x-requested-with": "XMLHttpRequest"
      }
    });
    const $ = cheerio.load(await data.text());
    const $days = $(
      "table.ContributionCalendar-grid td.ContributionCalendar-day"
    );

    const contribText = $(".js-yearly-contributions h2")
      .text()
      .trim()
      .match(/^([0-9,]+)\s/);
    let contribCount;
    if (contribText) {
      [contribCount] = contribText;
      contribCount = parseInt(contribCount.replace(/,/g, ""), 10);
    }

    return {
      year,
      total: contribCount || 0,
      range: {
        start: $($days.get(0)).attr("data-date"),
        end: $($days.get($days.length - 1)).attr("data-date")
      },
      contributions: (() => {
        const parseDay = (day, index) => {
          const $day = $(day);
          const date = $day
            .attr("data-date")
            .split("-")
            .map((d) => parseInt(d, 10));
          const color = COLOR_MAP[$day.attr("data-level")];
          const value = {
            date: $day.attr("data-date"),
            count: index === 0 ? contribCount : 0,
            color,
            intensity: $day.attr("data-level") || 0
          };
          return { date, value };
        };

        if (this.format !== FormatEnum.nested) {
          return $days.get().map((day, index) => parseDay(day, index).value);
        }

        return $days.get().reduce((o, day, index) => {
          const { date, value } = parseDay(day, index);
          const [y, m, d] = date;
          if (!o[y]) o[y] = {};
          if (!o[y][m]) o[y][m] = {};
          o[y][m][d] = value;
          return o;
        }, {});
      })()
    };
  }

  private delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  public async fetchDataForAllYears(): Promise<UserContributions> {
    const years = await this.fetchYears();
    return await Promise.all(
      years.map((year) => this.fetchDataForYear(year.href, year.text))
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
              })
      };
    });
  }

  public setUserName = (username: string) => {
    this.username = username;
  }
  public setFormat = (format: FormatEnum) => {
    this.format = format;
  }
}

// Singleton instance
let githubServiceInstance: GithubService | null = null;

export function getGithubService(): GithubService {
  if (!githubServiceInstance) {
    githubServiceInstance = new GithubService();
  }
  return githubServiceInstance;
}

export default githubServiceInstance;
