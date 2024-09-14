<script>
	import { userStore } from '~/store';
	import HighchartsWrapper from './highcharts-wrapper.svelte';

	let options = {};

	userStore.subscribe((value) => {
		options = {
			chart: { type: 'areaspline' },
			title: { text: 'Code Retention Over Time', align: 'left' },
			xAxis: {
				title: { text: 'Time' },
				categories: value.repoData?.map((item) => item.name)
			},
			yAxis: {
				title: { text: 'Lines of Code' }
			},
			series: value.repoData.map((item) => ({
				name: item.name,
				data: [...item.data]
			})),
			tooltip: {
				shared: true,
				headerFormat: '<table>',
				pointFormat:
					`<tr><td><span style="color:{series.color};">●</span></td><td>{series.name}</td>` +
					`<td style="text-align: right"><b>{point.y}</b></td></tr>`,
				footerFormat: '</table>',
				useHTML: true
			},
			plotOptions: {
				areaspline: {
					stacking: 'normal',
					lineColor: '#666666',
					lineWidth: 1,
					marker: {
						enabled: false,
						symbol: 'circle',
						fillColor: '#666666',
						lineColor: '#666666',
						radius: 1
					},
					label: { style: { fontSize: '16px' } },
					states: { hover: { halo: { size: 0 } } }
				}
			}
		};
	});
</script>

<div class="chartWrapper">
	<HighchartsWrapper {options} />
</div>

<style>
	.chartWrapper {
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center; 
	}
</style>
