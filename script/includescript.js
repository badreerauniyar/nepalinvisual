
let countyData
let educationData
let nepalData
let populationData

let nepalUrl="./data/nepal-districts.topo.json"
let populationUrl="./data/district_pop.csv"
console.log(populationUrl);
let canvas = d3.select('#canvas')

var x = d3.scaleLinear().domain([2.6, 25.1]).rangeRound([600, 860]);

var color = d3
  .scaleThreshold()
  .domain(d3.range(2.6, 75.1, (75.1 - 2.6) / 8))
  .range(d3.schemeReds[4]);

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
          .attr("fill",(d)=>{
            var letters = '0123456789ABCDEF';
              var color = '#';
              for (var i = 0; i < 6; i++) {
                color += letters[Math.floor(Math.random() * 16)];
              }
              return color
          })
           .attr("stroke","black")
            .on("mouseover",function(countyDataItem) {
              console.log("mouseover");
                //gettting the name of state and its details
                let id=countyDataItem.properties.name.toLowerCase().replace(/^\s+|\s+$/g, "");
                
                // console.log(populationData);
                let state=populationData.find((item)=>{
                  var itemDistrict=item.District.toLowerCase().replace(/^\s+|\s+$/g, "");
                 return(itemDistrict==id)
                })
                //Get this bar's x/y values, then augment for the tooltip
                var xPosition = parseFloat(event.pageX+30);
                var yPosition = parseFloat(event.pageY-20);
                //Update the tooltip position and value
                d3.select("#tooltip")
                  .style("left", xPosition + "px")
                  .style("top", yPosition + "px");
                d3.select("#tooltip #heading")
                  .text("name :" +state.District);
                d3.select("#tooltip #population")
                  .text("Population:"+state.Population);
                d3.select("#tooltip #area")
                  .text("Population Density:" +state.PopulationDensity);
          
          
          
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


 }
 d3.json(nepalUrl).then(
    (data, error) => {
        if(error){
            console.log(error)
        }else{
          
           nepalData = topojson.feature(data, data.objects.districts);
           
            nepalData =nepalData.features;
            // console.log('Nepal Data')
            console.log(nepalData)

            drawMap();

        }
    }
)

