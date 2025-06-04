<script lang="ts">
import type { Snippet } from "svelte";
import type { HTMLAttributes } from "svelte/elements";
 import Chart from "chart.js/auto";

 Chart.defaults.font.size = 16;

  type Props = {
    graph?: { x: string; y: number }[];
    children?: Snippet;
  } & HTMLAttributes<HTMLAnchorElement>

  let {graph, children, ... restProps}: Props = $props()

  let chartObject: Chart | undefined;

  const data = graph;

  function changeData() {
    graph = [];
  }
	
  
	
  function chart(node: HTMLCanvasElement, data: number[]) {
    function setupChart(_data: number[], ptogression : string[]) {
			chartObject = new Chart(node, {
        type: "line",
        data: {
          datasets: [
            {
              label: "Progression",
              data: _data,
              borderWidth: 1,
              borderColor: 'rgba(255, 99, 132, 1)',
              backgroundColor: 'rgba(255, 99, 132, 0.2)',
              fill: true
            },
          ],
        },
        options: {
          scales: {
            y: {
              min: 40,
              max: 200,
            },
          },
          plugins: {
            legend: {
              labels: {
                color: 'rgb(176, 55, 180',
              },
            }
          }
        },
      });
		}

		setupChart(data)
		return {
			update(data) {
				chartObject.destroy();
				setupChart(data);
			},
			destroy() {
				chartObject.destroy();
			}
		}
	}

</script>

<div>
  <canvas class="chart w-3xl" use:chart={data}>
  </canvas>
</div>
