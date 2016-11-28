google.charts.load('current', {'packages':['corechart', 'line']});

      // Set a callback to run when the Google Visualization API is loaded.
      google.charts.setOnLoadCallback(drawChart);

      // Callback that creates and populates a data table,
      // instantiates the pie chart, passes in the data and
      // draws it.
      function drawChart() {

      	console.log(graphData)

        // Create the data table.
        var data = new google.visualization.DataTable();
        data.addColumn('date', 'X');
        data.addColumn('number', 'Price');
     
        data.addRows(graphData)

        // Set chart options
        var options = {
	        hAxis: {
	          title: 'Time'
	        },
	        vAxis: {
	          title: 'Price'
	        }
	      };

        // Instantiate and draw our chart, passing in some options.
        var chart = new google.visualization.LineChart(document.getElementById('chart_div'));
        chart.draw(data, options);
      }