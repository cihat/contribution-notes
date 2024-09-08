<script>
  import { onMount } from "svelte";
  import { themes } from "./themes"; // İlgili themes dosyasını import edin

  export let options;

  let canvas;
  let tooltip;

  function getPixelRatio() {
    if (typeof window === "undefined") {
      return 1;
    }
    return window.devicePixelRatio || 1;
  }

  const DATE_FORMAT = "yyyy-MM-dd";
  const boxWidth = 10;
  const boxMargin = 2;
  const textHeight = 15;
  const defaultFontFace = "IBM Plex Mono";
  const headerHeight = 60;
  const canvasMargin = 20;
  const yearHeight = textHeight + (boxWidth + boxMargin) * 8 + canvasMargin;
  const scaleFactor = getPixelRatio();

  function getTheme(opts) {
    const { themeName, customTheme } = opts;
    if (customTheme) {
      return {
        background: customTheme.background ?? themes.standard.background,
        text: customTheme.text ?? themes.standard.text,
        meta: customTheme.meta ?? themes.standard.meta,
        grade4: customTheme.grade4 ?? themes.standard.grade4,
        grade3: customTheme.grade3 ?? themes.standard.grade3,
        grade2: customTheme.grade2 ?? themes.standard.grade2,
        grade1: customTheme.grade1 ?? themes.standard.grade1,
        grade0: customTheme.grade0 ?? themes.standard.grade0
      };
    }
    const name = themeName ?? "standard";
    return themes[name] ?? themes.standard;
  }

  function getDateInfo(data, date) {
    return data.contributions.find(contrib => contrib.date === date);
  }

  function darkenColor(color, percent) {
    const num = parseInt(color.slice(1), 16),
      amt = Math.round(2.55 * percent),
      R = (num >> 16) + amt,
      G = (num >> 8 & 0x00FF) + amt,
      B = (num & 0x0000FF) + amt;
    return `#${(0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 + (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 + (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1).toUpperCase()}`;
  }

  function drawYear(ctx, opts, hoverCallback) {
    const { year, offsetX = 0, offsetY = 0, data, fontFace = defaultFontFace } = opts;
    const theme = getTheme(opts);

    const today = new Date();
    const thisYear = today.getFullYear().toString();
    const lastDate = year.year === thisYear ? today : new Date(year.range.end);
    const firstRealDate = new Date(`${year.year}-01-01`);
    const firstDate = new Date(firstRealDate.setDate(firstRealDate.getDate() - firstRealDate.getDay()));

    let nextDate = firstDate;
    const firstRowDates = [];
    const graphEntries = [];

    while (nextDate <= lastDate) {
      const date = nextDate.toISOString().split('T')[0];
      firstRowDates.push({ date, info: getDateInfo(data, date) });
      nextDate = new Date(nextDate.setDate(nextDate.getDate() + 7));
    }

    graphEntries.push(firstRowDates);

    for (let i = 1; i < 7; i += 1) {
      graphEntries.push(
        firstRowDates.map(dateObj => {
          const date = new Date(dateObj.date);
          date.setDate(date.getDate() + i);
          return { date: date.toISOString().split('T')[0], info: getDateInfo(data, date.toISOString().split('T')[0]) };
        })
      );
    }

    if (!opts.skipHeader) {
      ctx.textBaseline = "hanging";
      ctx.fillStyle = theme.text;
      ctx.font = `10px '${fontFace}'`;
      ctx.fillText(
        `${year.year}: ${year.total} Contribution${year.total === 1 ? "" : "s"}${thisYear === year.year ? " (so far)" : ""}`,
        offsetX,
        offsetY - 17
      );
    }

    for (let y = 0; y < graphEntries.length; y += 1) {
      for (let x = 0; x < graphEntries[y].length; x += 1) {
        const day = graphEntries[y][x];
        const cellDate = new Date(day.date);
        if (cellDate > lastDate || !day.info) continue;
        const color = theme[`grade${day.info.intensity}`];
        const darkColor = darkenColor(color, -20);
        const rectX = offsetX + (boxWidth + boxMargin) * x;
        const rectY = offsetY + textHeight + (boxWidth + boxMargin) * y;

        const radius = 2;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(rectX + radius, rectY);
        ctx.lineTo(rectX + boxWidth - radius, rectY);
        ctx.quadraticCurveTo(rectX + boxWidth, rectY, rectX + boxWidth, rectY + radius);
        ctx.lineTo(rectX + boxWidth, rectY + boxWidth - radius);
        ctx.quadraticCurveTo(rectX + boxWidth, rectY + boxWidth, rectX + boxWidth - radius, rectY + boxWidth);
        ctx.lineTo(rectX + radius, rectY + boxWidth);
        ctx.quadraticCurveTo(rectX, rectY + boxWidth, rectX, rectY + boxWidth - radius);
        ctx.lineTo(rectX, rectY + radius);
        ctx.quadraticCurveTo(rectX, rectY, rectX + radius, rectY);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = darkColor;
        ctx.lineWidth = 1;
        ctx.stroke();

        if (hoverCallback) {
          hoverCallback(rectX, rectY, day.info);
        }
      }
    }

    let lastCountedMonth = 0;
    for (let y = 0; y < graphEntries[0].length; y += 1) {
      const date = new Date(graphEntries[0][y].date);
      const month = date.getMonth() + 1;
      const firstMonthIsDec = month === 12 && y === 0;
      const monthChanged = month !== lastCountedMonth;
      if (!opts.skipAxisLabel && monthChanged && !firstMonthIsDec) {
        ctx.fillStyle = theme.meta;
        ctx.fillText(
          date.toLocaleString('default', { month: 'short' }),
          offsetX + (boxWidth + boxMargin) * y,
          offsetY
        );
        lastCountedMonth = month;
      }
    }
  }

  function drawMetaData(ctx, opts) {
    const { username, width, height, footerText, data, fontFace = defaultFontFace } = opts;
    const theme = getTheme(opts);
    ctx.fillStyle = theme.background;
    ctx.fillRect(0, 0, width, height);

    if (footerText) {
      ctx.fillStyle = theme.meta;
      ctx.textBaseline = "bottom";
      ctx.font = `10px '${fontFace}'`;
      ctx.fillText(footerText, canvasMargin, height - 5);
    }

    // chart legend
    let themeGrades = 5;
    ctx.fillStyle = theme.text;
    ctx.fillText(
      "Less",
      width - canvasMargin - (boxWidth + boxMargin) * themeGrades - 55,
      37
    );
    ctx.fillText("More", width - canvasMargin - 25, 37);
    for (let x = 0; x < 5; x += 1) {
      ctx.fillStyle = theme[`grade${x}`];
      ctx.fillRect(
        width - canvasMargin - (boxWidth + boxMargin) * themeGrades - 27,
        textHeight + boxWidth,
        10,
        10
      );
      themeGrades -= 1;
    }

    ctx.fillStyle = theme.text;
    ctx.textBaseline = "hanging";
    ctx.font = `20px '${fontFace}'`;
    ctx.fillText(`@${username} on GitHub`, canvasMargin, canvasMargin);

    let totalContributions = 0;
    for (const year of data.years) {
      totalContributions += year.total;
    }
    ctx.font = `10px '${fontFace}'`;
    ctx.fillText(
      `Total Contributions: ${totalContributions}`,
      canvasMargin,
      canvasMargin + 30
    );

    ctx.beginPath();
    ctx.moveTo(canvasMargin, 55 + 10);
    ctx.lineTo(width - canvasMargin, 55 + 10);
    ctx.strokeStyle = theme.grade0;
    ctx.stroke();
  }

  function drawContributions(canvas, opts) {
    const { data } = opts;
    let headerOffset = 0;
    if (!opts.skipHeader) {
      headerOffset = headerHeight;
    }
    const height = data.years.length * yearHeight + canvasMargin + headerOffset + 10;
    const width = 53 * (boxWidth + boxMargin) + canvasMargin * 2;

    canvas.width = width * scaleFactor;
    canvas.height = height * scaleFactor;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const ctx = canvas.getContext("2d");

    if (!ctx) {
      throw new Error("Could not get 2d context from Canvas");
    }

    ctx.scale(scaleFactor, scaleFactor);
    ctx.textBaseline = "hanging";

    const hoverAreas = [];

    data.years.forEach((year, i) => {
      const offsetY = yearHeight * i + canvasMargin + headerOffset + 10;
      const offsetX = canvasMargin;
      drawYear(ctx, {
        ...opts,
        year,
        offsetX,
        offsetY,
        data
      }, (x, y, info) => hoverAreas.push({ x, y, info }));
    });

    if (!opts.skipHeader) {
      drawMetaData(ctx, {
        ...opts,
        width,
        height,
        data
      });
    }

    canvas.addEventListener('mousemove', (event) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = (event.clientX - rect.left) / scaleFactor;
      const mouseY = (event.clientY - rect.top) / scaleFactor;

      const hoverArea = hoverAreas.find(area => 
        mouseX >= area.x && mouseX <= area.x + boxWidth &&
        mouseY >= area.y && mouseY <= area.y + boxWidth
      );

      if (hoverArea) {
        tooltip.innerHTML = `Date: ${hoverArea.info.date}<br>Count: ${hoverArea.info.count}`;
        tooltip.style.left = `${event.clientX + 10}px`;
        tooltip.style.top = `${event.clientY + 10}px`;
        tooltip.style.display = 'block';
      } else {
        tooltip.style.display = 'none';
      }
    });
  }

  onMount(() => {
    drawContributions(canvas, options);
  });
</script>

<style>
  #tooltip {
    position: absolute;
    background-color: rgba(0, 0, 0, 0.7);
		color: white;
		padding: 5px;
		border-radius: 3px;
		pointer-events: none;
		display: none;
	}
</style>
