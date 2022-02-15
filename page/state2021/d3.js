
let countyData
let educationData
let nepalData
let populationData

let nepalUrl="./data/nepal-states.geojson"
let populationUrl="./data/statewisePopulationData.csv"
let populationBydistrict="./data/Population District Level 2011.xlsx"
console.log(populationUrl);
let canvas = d3.select('#canvas')
let tooltip=d3.select('#tooltip')

var x = d3.scaleLinear().domain([2.6, 25.1]).rangeRound([600, 860]);

var color = d3
  .scaleThreshold()
  .domain(d3.range(2.6, 75.1, (75.1 - 2.6) / 8))
  .range(d3.schemeReds[4]);

  var g = canvas
  .append('g')
  .attr('class', 'key')
  .attr('id', 'legend')
  .attr('transform', 'translate(0,40)');

g.selectAll('rect')
  .data(
    color.range().map(function (d) {
      d = color.invertExtent(d);
      if (d[0] === null) {
        d[0] = x.domain()[0];
      }
      if (d[1] === null) {
        d[1] = x.domain()[1];
      }
      return d;
    })
  )
  .enter()
  .append('rect')
  .attr('height', 12)
  .attr('x', function (d) {
    return x(d[0]);
  })
  .attr('width', function (d) {
    return d[0] && d[1] ? x(d[1]) - x(d[0]) : x(null);
  })
  .attr('fill', function (d) {
    return color(d[0]);
  });

  g.append('text')
  .attr('class', 'caption')
  .attr('x', x.range()[0])
  .attr('y', -6)
  .attr('fill', '#000')
  .attr('text-anchor', 'start')
  .attr('font-weight', 'bold');

g.call(
  d3
    .axisBottom(x)
    .tickSize(13)
    .tickFormat(function (x) {
      return Math.round(x) + '%';
    })
    .tickValues(color.domain())
)
  .select('.domain')
  .remove();


var width = 960,
    height = 500,
    centered;

var projection = d3.geoMercator() 
.scale(5300)
.translate([width / 2, height / 2])
.center([83.985593872070313, 28.465876770019531]);

var path = d3.geoPath()
            .projection(projection);


let drawMap=()=>{
    console.log("function called");
    canvas
    .append('g')
    .attr('class', 'states')
    .selectAll('path')
            .data(nepalData)
            .enter()
            .append('path')
            .attr('d', path)
            .attr('class', 'county')
            .attr("fill", function(countyDataItem) {
                //Get data value
                let id=countyDataItem.properties.ADM1_EN
                
                // console.log(populationData);
                let state=populationData.find((item)=>{
                    return (item['id']===id )
                })
                var value = state.percentage;
         
                if (value) {
                        //If value exists…
                        return color(value);
                } else {
                        //If value is undefined…
                        return "#ddd";
                }
           })
           .attr("stroke","black")
            // .attr('fill',(countyDataItem)=>{
            //     let id=countyDataItem.properties.ADM1_EN
            //     var letters = '0123456789ABCDEF';
            //     var color = '#';
            //     for (var i = 0; i < 6; i++) {
            //       color += letters[Math.floor(Math.random()* 16)];
            //     }
            //     console.log(color);
            //     return color;
            // })
            .on("mouseover",function(countyDataItem) {
              console.log("mouseover");
                //gettting the name of state and its details
                let id=countyDataItem.properties.ADM1_EN
                
                // console.log(populationData);
                let state=populationData.find((item)=>{
                    return (item['id']===id )
                })
                //Get this bar's x/y values, then augment for the tooltip
                var xPosition = parseFloat(event.pageX+30);
                var yPosition = parseFloat(event.pageY-20);
                //Update the tooltip position and value
                d3.select("#tooltip")
                  .style("left", xPosition + "px")
                  .style("top", yPosition + "px");
                d3.select("#tooltip #heading")
                  .text(state.Province);
                d3.select("#tooltip #area")
                  .text(state.population);
                d3.select("#tooltip #population")
                  .text(state.percentage);
          
          
          
                //Show the tooltip
                d3.select("#tooltip").classed("hidden", false);
          
                d3.select(this.parentNode.appendChild(this))
                 //.transition()
                 //.duration(100)
                  .style({'stroke-width':1,'stroke':'#333','stroke-linejoin':'round',
                          'stroke-linecap': 'round', 'cursor':'pointer'});
            })
            .on('mouseout',function(countyDataItem){
              console.log("mouseout");
              d3.select("#tooltip").classed("hidden", true);
              // tooltip.transition()
              //     .classed('visibility','hidden') 
          })

            
          
            // .append("text").text(function(countyDataItem) {
            //     console.log("texthhh");
            //      return countyDataItem.properties.ADM1_EN;
            // })
            
            // .attr('fill',(countyDataItem)=>{
                
            //     let id=countyDataItem.properties.ADM1_EN
            //     console.log(id);
            //     // console.log(populationData);
            //     let state=populationData.find((item)=>{
            //         return (item['id']===id )
            //     })
            //     console.log(state['Province']);
            //     let percentage=state['percentage']
            //     if(percentage<=15){
            //         return 'red'
            //     }else if(percentage<=30){
            //         return 'orange'
            //     }else if(percentage<=45){
            //         return 'lightgreen'
            //     }else{
            //         return 'limegreen'
            //     }
            // })
            // .attr('data-fips',(countyDataItem)=>{
            //     return countyDataItem['id']
            // })
            // .attr('data-education',(countyDataItem)=>{
            //     let id=countyDataItem['id']
            //     let county=educationData.find((item)=>{
            //         return item['fips']===id
            //     })
            //     let percentage=county['bachelorsOrHigher']
            //     return percentage
            // })
            // .on('mouseover',(countyDataItem)=>{
            //     tooltip.transition()
            //         .style('visibility','visible')
            //         let id=countyDataItem['id']
            //         let county=educationData.find((item)=>{
            //             return item['fips']===id
            //         })
            //         tooltip.text(county['fips'] + ' - ' + county['area_name'] + ', ' + 
            //         county['state'] + ' : ' + county['bachelorsOrHigher'] + '%')
            //         tooltip.attr('data-education',county['bachelorsOrHigher'])
            //         canvas.select('path').attr('fill','black')
            // })
           

 }
 d3.json(nepalUrl).then(
    (data, error) => {
        if(error){
            console.log(error)
        }else{
            nepalData = data
            nepalData =nepalData.features;
            // console.log('Nepal Data')
            // console.log(nepalData)

            d3.csv(populationUrl).then(
                (data, error) => {
                    if(error){
                        console.log(error)
                    }
                    else{
                        populationData = data
                        // console.log('Education Data')
                        // console.log(educationData)
                        
                    }
                    drawMap()
                }
            )

        }
    }
)

// canvas
//     .append('path')
//     .datum(
//       topojson.mesh(nepalData, nepalData, function (a, b) {
//         return a !== b;
//       })
//     )
//     .attr('class', 'states')
//     .attr('d', path);
// d3.json(countyURL).then(
//     (data, error) => {
//         if(error){
//             console.log(error)
//         }else{
//             countyData = data
//             countyData = topojson.feature(countyData, countyData.objects.counties).features;
//             console.log('County Data')
//             console.log(countyData)

//             d3.json(educationURL).then(
//                 (data, error) => {
//                     if(error){
//                         console.log(error)
//                     }
//                     else{
//                         educationData = data
//                         console.log('Education Data')
//                         console.log(educationData)
//                         drawMap()
//                     }
//                 }
//             )

//         }
//     }
// )

