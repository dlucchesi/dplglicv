<script lang="ts">
  import { LayerCake, Svg } from 'layercake'
  import type { Snippet } from "svelte";
  import type { HTMLAttributes } from "svelte/elements";

  import Line from '@/components/chart/Line.svelte';
  import Area from '@/components/chart/Area.svelte';
  import AxisX from '@/lib/components/chart/AxisX.svelte';
  import AxisY from '@/components/chart/AxisY.svelte';

  type Props = {
    chartData?: any[]; // Data should be an array of objects
    x?: string;
    y?: string;
    children?: Snippet;
  } & HTMLAttributes<HTMLAnchorElement>

  let {chartData, x, y, children, ...restProps}: Props = $props()

  let xKey = 'date';
  let yKey = 'weight';

  chartData = [
    { year: 2025, month: 5, day: 19, weight: 155.5, date: 20250519 },
    { year: 2025, month: 5, day: 21, weight: 154.7, date: 20250521 },
    { year: 2025, month: 5, day: 29, weight: 155, date: 20250529 }
  ];

  console.log("chartData", chartData);
</script>

<div class="chart-container">
  <LayerCake
    padding={{ top: 80, right: 10, bottom: 20, left: 25 }}
    x={xKey}
    y={yKey}

    data={chartData}
    debug
  >
    <Svg>
      <AxisX />
      <AxisY />
      <Line />
      <Area />
    </Svg>
  </LayerCake>
</div>

<style>
  .chart-container {
    width: 100%;
    height: 300px;
  }
</style>