import { Component } from "react";
const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });
import dynamic from "next/dynamic";
import { Button } from "react-bootstrap";
// 

export class Basicpiechart extends Component {
	constructor(props) {
		super(props);

		this.state = {
			series: [44, 55, 13, 43, 22],
			options: {
				chart: {
					height: 300,
					type: "pie",
					events: {
						mounted: (chart) => {
							chart.windowResizeHandler();
						}
					},
				},
				colors: ["#38cab3", "#4ec2f0", "#f5b849", "#49b6f5", "#e6533c"],
				labels: ["Team A", "Team B", "Team C", "Team D", "Team E"],
				legend: {
					position: "bottom"
				},
				dataLabels: {
					dropShadow: {
						enabled: false
					}
				},
			}

		};
	}

	render() {
		return (
			<ReactApexChart options={this.state.options} series={this.state.series} type="pie" height={300} />

		);
	}
}
//Simpledonut
export class Simpledonut extends Component {
	constructor(props) {
		super(props);

		this.state = {
			series: [44, 55, 41, 17, 15],
			options: {
				chart: {
					type: "donut",
					height: 290,
					events: {
						mounted: (chart) => {
							chart.windowResizeHandler();
						}
					},
				},
				legend: {
					position: "bottom"
				},
				colors: ["#38cab3", "#4ec2f0", "#f5b849", "#49b6f5", "#e6533c"],
				dataLabels: {
					dropShadow: {
						enabled: false
					}
				},
			}

		};
	}

	render() {
		return (
			<ReactApexChart options={this.state.options} series={this.state.series} type="donut" height={300} />

		);
	}
}
//Updatingdonut

export class Updatingdonut extends Component {
	constructor(props) {
		super(props);

		this.state = {
			series: [44, 55, 13, 33],
			colors: ["#38cab3", "#4ec2f0", "#f5b849", "#e6533c", "#49b6f5"],
			options: {
				chart: {
					height: 280,
					type: "donut",
					events: {
						mounted: (chart) => {
							chart.windowResizeHandler();
						}
					},
				},
				dataLabels: {
					enabled: false,
				},
				colors: ["#38cab3", "#4ec2f0", "#f5b849", "#e6533c", "#49b6f5"],
				legend: {
					position: "bottom",
				},
			},
		};
	}

	appendData() {
		const arr = this.state.series.slice();
		arr.push(Math.floor(Math.random() * (100 - 1 + 1)) + 1);

		this.setState({
			series: arr,
		});
	}

	removeData() {
		if (this.state.series.length === 1) return;

		const arr = this.state.series.slice();
		arr.pop();

		this.setState({
			series: arr,
		});
	}

	randomize() {
		this.setState({
			series: this.state.series.map(function () {
				return Math.floor(Math.random() * (100 - 1 + 1)) + 1;
			}),
		});
	}

	reset() {
		this.setState({
			series: [44, 55, 13, 33],
		});
	}

	render() {
		return (

			<div>
				<div id="chart">
					<ReactApexChart options={this.state.options} series={this.state.series} type="donut" height={280} />
				</div>

				<div className="text-center mt-4">
					<Button variant='primary' size="sm" className="m-1"
						onClick={() => this.appendData()}
					>
						+ ADD
					</Button>
					&nbsp;
					<Button variant='primary' size="sm" className="m-1"
						onClick={() => this.removeData()}
					>
						- REMOVE
					</Button>
					&nbsp;
					<Button variant='primary' size="sm" className="m-1"
						onClick={() => this.randomize()}
					>
						RANDOMIZE
					</Button>
					&nbsp;
					<Button variant='primary' size="sm" className="m-1"
						onClick={() => this.reset()}
					>
						RESET
					</Button>
				</div>
			</div>
		);
	}
}
//Monochrome
export class Monochrome extends Component {
	constructor(props) {
		super(props);

		this.state = {
			series: [25, 15, 44, 55, 41, 17],
			options: {
				chart: {
					height: "280",
					type: "pie",
					events: {
						mounted: (chart) => {
							chart.windowResizeHandler();
						}
					},
				},
				labels: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
				theme: {
					monochrome: {
						enabled: true,
						color: "#38cab3",
					}
				},
				plotOptions: {
					pie: {
						dataLabels: {
							offset: -5
						}
					}
				},
				title: {
					text: "Monochrome Pie",
					align: "left",
					style: {
						fontSize: "13px",
						fontWeight: "bold",
						color: "#8c9097"
					},
				},
				dataLabels: {
					// formatter(val, opts) {
					//     const name = opts.w.globals.labels[opts.seriesIndex]
					//     return [name, val.toFixed(1) + '%']
					// },
					dropShadow: {
						enabled: false
					}
				},
				legend: {
					show: false
				}
			},

		};
	}

	render() {
		return (

			<div id="chart">
				<ReactApexChart options={this.state.options} series={this.state.series} type="pie" height={280} />
			</div>

		);
	}
}
//Gradientpie
export class Gradientpie extends Component {
	constructor(props) {
		super(props);

		this.state = {
			series: [44, 55, 41, 17, 15],
			options: {
				chart: {
					height: 300,
					type: "donut",
					events: {
						mounted: (chart) => {
							chart.windowResizeHandler();
						}
					},
				},
				plotOptions: {
					pie: {
						startAngle: -90,
						endAngle: 270
					}
				},
				dataLabels: {
					enabled: false
				},
				fill: {
					type: "gradient",
				},
				legend: {
					formatter: function (val, opts) {
						return val + " - " + opts.w.globals.series[opts.seriesIndex];
					},
					position: "bottom"
				},
				colors: ["#38cab3", "#38cab3", "#f5b849", "#49b6f5", "#e6533c"],
				title: {
					text: "Gradient Donut with custom Start-angle",
					align: "left",
					style: {
						fontSize: "13px",
						fontWeight: "bold",
						color: "#8c9097"
					},
				},
				// legend: {
				//     position: 'bottom'
				// },
			},

		};
	}

	render() {
		return (

			<div id="chart">
				<ReactApexChart options={this.state.options} series={this.state.series} type="donut" height={300} />
			</div>

		);
	}
}
//Donutwithpattern
export class Donutwithpattern extends Component {
	constructor(props) {
		super(props);

		this.state = {
			series: [44, 55, 41, 17, 15],
			options: {
				chart: {
					height: 250,
					type: "donut",
					dropShadow: {
						enabled: true,
						color: "#111",
						top: -1,
						left: 3,
						blur: 3,
						opacity: 0.2
					},
					events: {
						mounted: (chart) => {
							chart.windowResizeHandler();
						}
					},
				},
				stroke: {
					width: 0,
				},
				plotOptions: {
					pie: {
						donut: {
							labels: {
								show: true,
								total: {
									showAlways: true,
									show: true
								}
							}
						}
					}
				},
				colors: ["#38cab3", "#38cab3", "#f5b849", "#49b6f5", "#e6533c"],
				labels: ["Comedy", "Action", "SciFi", "Drama", "Horror"],
				dataLabels: {
					enabled: true,
					style: {
						colors: ["#111"]
					},
					background: {
						enabled: true,
						foreColor: "#fff",
						borderWidth: 0
					}
				},
				fill: {
					type: "pattern",
					opacity: 1,
					pattern: {
						// enabled: true,
						style: ["verticalLines", "squares", "horizontalLines", "circles", "slantedLines"],
					},
				},
				states: {
					hover: {
						// filter: 'none'
					}
				},
				theme: {
					palette: "palette2"
				},
				title: {
					text: "Favourite Movie Type",
					align: "left",
					style: {
						fontSize: "13px",
						fontWeight: "bold",
						color: "#8c9097"
					},
				},
				responsive: [{
					breakpoint: 480,
					options: {
						chart: {
							width: 200
						},
						legend: {
							position: "bottom"
						}
					}
				}]
			},

		};
	}

	render() {
		return (

			<div id="chart">
				<ReactApexChart options={this.state.options} series={this.state.series} type="donut" height={250} />
			</div>

		);
	}
}
//Imagefilledpie
export class Imagefilledpie extends Component {
	constructor(props) {
		super(props);

		this.state = {
			series: [44, 33, 54, 45],
			options: {
				chart: {
					height: 300,
					type: "pie",
					events: {
						mounted: (chart) => {
							chart.windowResizeHandler();
						}
					},
				},
				colors: ["#93C3EE", "#E5C6A0", "#669DB5", "#94A74A"],
				fill: {
					type: "image",
					opacity: 0.85,
					image: {
						src: ["../../../../assets/images/media/media-21.jpg", "../../../../assets/images/media/media-21.jpg", "../../../../assets/images/media/media-21.jpg", "../../../../assets/images/media/media-21.jpg"],
						width: 25
					},
				},
				stroke: {
					width: 4
				},
				dataLabels: {
					enabled: true,
					style: {
						colors: ["#111"]
					},
					background: {
						enabled: true,
						foreColor: "#fff",
						borderWidth: 0
					}
				},
				legend: {
					position: "bottom"
				},
			},

		};
	}

	render() {
		return (

			<div id="chart">
				<ReactApexChart options={this.state.options} series={this.state.series} type="pie" height={300} />
			</div>

		);
	}
}

