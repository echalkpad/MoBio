angular.module('mobio.controllers')

        .controller('HeartRateCtrl', function ($scope, $timeout, $compile) {


            $scope.data = {
                subscribed: false,
                discovered: [],
                selectedDevice: {},
                heartRateData: [],
                chartData: [{x: 0, y: 50}],
                page4AddtData: {},
                cumulativeOperatingTime: {},
                manufacturerAndSerial: {},
                versionAndModelEvent: {},
                calculatedRrIntervalEvent: {},
                deviceStateChange: {}
            };

            $scope.testUpdateData = function () {
                updateData();
                //$scope.drawLineChart();
            };

            function updateData() {

                // Scale the range of the data again 
                /*x.domain(d3.extent(data, function (d) {
                 return d.date;
                 }));
                 y.domain([0, d3.max(data, function (d) {
                 return d.close;
                 })]);*/

                // Select the section we want to apply our changes to
                //var svg = d3.select("body").transition();

                var data = [
//                    [
//                        {'x': 0, 'y': 57},
//                        {'x': 1, 'y': 60},
//                        {'x': 2, 'y': 65},
//                        {'x': 3, 'y': 66},
//                        {'x': 4, 'y': 63},
//                        {'x': 5, 'y': 55}
//                    ]
                    $scope.data.chartData
                ];

                $scope.x.domain([0, d3.max(data[0], function (d) {
                        return d.x;
                    }) + 5])
                        .range([0, $scope.width]);

                $scope.y.domain([d3.min(data[0], function (d) {
                        return d.y;
                    }) - 5, d3.max(data[0], function (d) {
                        return d.y;
                    }) + 5])
                        .range([$scope.height, 0]);

                $scope.xAxis.scale($scope.x);
                $scope.yAxis.scale($scope.y);


                // Make the changes
                $scope.svg.selectAll('.line')
                        .data(data)


                $scope.svg.select(".x.axis").call($scope.xAxis);
                $scope.svg.select(".y.axis").call($scope.yAxis);
                $scope.svg.selectAll('path.line').attr('d', $scope.line);

                $scope.zoom
                        .x($scope.x)
                        .y($scope.y)
                //.scaleExtent([0, 10])
                //.on("zoom", zoomed);


            }

            $scope.spinner = {
                show: false
            };

            $scope.unsubscribeHR = function () {
                try {
                    antplus.unsubscribeHR();
                } catch (e) {
                    console.log("antplus is not defined");
                }
            };

            $scope.subscribeHR = function (antDeviceNumber) {
                try {
                    antplus.subscribeHR(antDeviceNumber,
                            function (readResult) {
                                $scope.$apply(
                                        function () {
                                            if (readResult.event == "heartRateData") {
                                                $scope.data.heartRateData.push(readResult);
                                                if (readResult.heartBeatCount) {
                                                    $scope.data.chartData[readResult.heartBeatCount] = {'x': readResult.heartBeatCount, 'y': readResult.heartRate};
                                                    updateData();
                                                }
                                            } else if (readResult.event == "page4AddtData") {
                                                $scope.data.page4AddtData = readResult;
                                            } else if (readResult.event == "cumulativeOperatingTime") {
                                                $scope.data.cumulativeOperatingTime = readResult;
                                            } else if (readResult.event == "manufacturerAndSerial") {
                                                $scope.data.manufacturerAndSerial = readResult;
                                            } else if (readResult.event == "versionAndModelEvent") {
                                                $scope.data.versionAndModelEvent = readResult;
                                            } else if (readResult.event == "calculatedRrIntervalEvent") {
                                                $scope.data.calculatedRrIntervalEvent = readResult;
                                            } else if (readResult.event == "deviceStateChange") {
                                                $scope.data.deviceStateChange = readResult;
                                            }

                                        });
                            }
                    ,
                            function (error) {
                                console.log(error);
                            });
                } catch (e) {
                    console.log("antplus is not defined");
                }
            };


            $scope.buttonListenClick = function () {
                $scope.data.heartRateData = [];
                $scope.data.chartData = [{x: 0, y: 50}];
                if ($scope.data.subscribed) {
                    $scope.unsubscribeHR();
                } else {
                    $scope.subscribeHR($scope.data.selectedDevice.antDeviceNumber);
                }
                $scope.data.subscribed = !$scope.data.subscribed;
            };

            $scope.buttonStopSearchClick = function () {
                $scope.spinner.show = false;
                antplus.stopSearchDevices(function (result) {
                    console.log(result);
                }, function (error) {
                    console.log(error);
                });
            };

            $scope.buttonStartSearchClick = function () {
                $scope.data.discovered = [];
                $scope.spinner.show = true;
                try {
                    antplus.searchDevices(
                            "HEARTRATE", //BLOOD_PRESSURE, WEIGHT_SCALE
                            function (result) {
                                $scope.$apply(
                                        function () {
                                            $scope.data.discovered.push(result);
                                        }
                                );
                            }
                    ,
                            function (error) {
                                console.log(error);
                            });
                } catch (e) {
                    console.log("antplus is not defined");
                }
            };

            //////////////// LINE CHART ///////////////////

            $scope.drawLineChart = function () {
                var w = document.getElementById("chartWrapperLiveHR").offsetWidth;
                var h = document.getElementById("chartWrapperLiveHR").offsetHeight;


                //************************************************************
                // Data notice the structure
                //************************************************************
                var data = [
                    $scope.data.chartData
//                    [
//                        {'x': 0, 'y': 57},
//                        {'x': 1, 'y': 60},
//                        {'x': 2, 'y': 165},
//                        {'x': 3, 'y': 66},
//                        {'x': 4, 'y': 63},
//                        {'x': 5, 'y': 55}
//                    ]
                ];


                var colors = [
                    'red'
                ];


                //************************************************************
                // Create Margins and Axis and hook our zoom function
                //************************************************************
                var margin = {top: 20, right: 15, bottom: 30, left: 30};
                $scope.width = w - margin.left - margin.right;
                $scope.height = h - margin.top - margin.bottom;

//                $scope.x = d3.scale.linear()
//                        .domain([0, 12])
//                        .range([0, $scope.width]);
//
//                $scope.y = d3.scale.linear()
//                        .domain([-1, 16])
//                        .range([$scope.height, 0]);

                $scope.x = d3.scale.linear()
                        .domain([0, d3.max(data[0], function (d) {
                                return d.x;
                            }) + 5])
                        .range([0, $scope.width]);

                $scope.y = d3.scale.linear()
                        .domain([d3.min(data[0], function (d) {
                                return d.y;
                            }) - 5, d3.max(data[0], function (d) {
                                return d.y;
                            }) + 5])
                        .range([$scope.height, 0]);

                $scope.xAxis = d3.svg.axis()
                        .scale($scope.x)
                        .tickSize(-$scope.height)
                        .tickPadding(10)
                        .tickSubdivide(true)
                        .orient("bottom");

                $scope.yAxis = d3.svg.axis()
                        .scale($scope.y)
                        .tickPadding(10)
                        .tickSize(-$scope.width)
                        .tickSubdivide(true)
                        .orient("left");

                $scope.zoom = d3.behavior.zoom()
                        .x($scope.x)
                        .y($scope.y)
                        .scaleExtent([0, 10])
                        .on("zoom", zoomed);





                //************************************************************
                // Generate our SVG object
                //************************************************************	
                d3.select("#chartLiveHR").selectAll('svg').remove();
                $scope.svg = d3.select("#chartLiveHR").append("svg")
                        .call($scope.zoom)
                        .attr("width", $scope.width + margin.left + margin.right)
                        .attr("height", $scope.height + margin.top + margin.bottom)
                        .append("g")
                        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                $scope.svg.append("g")
                        .attr("class", "x axis")
                        .attr("transform", "translate(0," + $scope.height + ")")
                        .call($scope.xAxis);

                $scope.svg.append("g")
                        .attr("class", "y axis")
                        .call($scope.yAxis);

//                svg.append("g")
//                        .attr("class", "y axis")
//                        .append("text")
//                        .attr("class", "axis-label")
//                        .attr("transform", "rotate(-90)")
//                        .attr("y", (-margin.left) + 10)
//                        .attr("x", -height / 2)
//                        .text('Axis Label');

                $scope.svg.append("clipPath")
                        .attr("id", "clip")
                        .append("rect")
                        .attr("width", $scope.width)
                        .attr("height", $scope.height);





                //************************************************************
                // Create D3 line object and draw data on our SVG object
                //************************************************************
                $scope.line = d3.svg.line()
                        .interpolate("linear")
                        .x(function (d) {
                            return $scope.x(d.x);
                        })
                        .y(function (d) {
                            return $scope.y(d.y);
                        });

                $scope.svg.selectAll('.line')
                        .data(data)
                        .enter()
                        .append("path")
                        .attr("class", "line")
                        .attr("clip-path", "url(#clip)")
                        .attr('stroke', function (d, i) {
                            return colors[i % colors.length];
                        })
                        .attr("d", $scope.line);




                //************************************************************
                // Draw points on SVG object based on the data given
                //************************************************************
                /*var points = svg.selectAll('.dots')
                 .data(data)
                 .enter()
                 .append("g")
                 .attr("class", "dots")
                 .attr("clip-path", "url(#clip)");
                 
                 points.selectAll('.dot')
                 .data(function (d, index) {
                 var a = [];
                 d.forEach(function (point, i) {
                 a.push({'index': index, 'point': point});
                 });
                 return a;
                 })
                 .enter()
                 .append('circle')
                 .attr('class', 'dot')
                 .attr("r", 2.5)
                 .attr('fill', function (d, i) {
                 return colors[d.index % colors.length];
                 })
                 .attr("transform", function (d) {
                 return "translate(" + x(d.point.x) + "," + y(d.point.y) + ")";
                 }
                 );
                 */





                //************************************************************
                // Zoom specific updates
                //************************************************************
                function zoomed() {
                    $scope.svg.select(".x.axis").call($scope.xAxis);
                    $scope.svg.select(".y.axis").call($scope.yAxis);
                    $scope.svg.selectAll('path.line').attr('d', $scope.line);

                    /*points.selectAll('circle').attr("transform", function (d) {
                     return "translate(" + x(d.point.x) + "," + y(d.point.y) + ")";
                     }
                     );*/
                }





                $compile(document.getElementById("chartId"))($scope);
            };

        });


