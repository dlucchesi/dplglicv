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

  let maxY = Math.max(...graph.map((g) => g.y)) + 10;

  let minY = Math.min(...graph.map((g) => g.y)) - 10;

  const data = graph;

  export function Update() {
    if (chartObject) {
      chartObject.update();
    }
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
          responsive: true,
          maintainAspectRatio: true,
          scales: {
            y: {
              min: minY,
              max: maxY,

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
  <canvas class="w-3xl border-2 border-blue-800 rounded-md bg-white shadow-lg
           mb-6 aspect-video" use:chart={data}>
  </canvas>
</div>
