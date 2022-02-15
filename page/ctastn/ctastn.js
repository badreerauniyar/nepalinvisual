
let countyData
let educationData
let nepalData
let populationData
let nepalarea=147181;
var characters = ["AB", "CD", "XY"];
let nepalUrl="https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json"
let populationUrl="./land.csv"
console.log(populationUrl);
let canvas = d3.select('#canvas')
let tooltip=d3.select('#tooltip')

var funct=(value)=>{
  if(value["2020"]<nepalarea){
    return true;
  }
}
var x = d3.scaleLinear().domain([2.6, 25.1]).rangeRound([600, 860]);

var color = d3
  .scaleThreshold()
  .domain(d3.range(2.6, 75.1, (75.1 - 2.6) / 8))
  .range(d3.schemeReds[4]);


var width = 960,
    height = 500,
    rotated;

// var projection = d3.geoMercator() 
// .scale(5300)
// .translate([width / 2, height / 2])
// .center([83.985593872070313, 28.465876770019531]);

var projection = d3.geoMercator()
        .scale(153)
        .translate([width/2,height/1.5])
        .rotate([rotated,0,0]); //center on USA because 'murica

    // var zoom = d3.behavior.zoom()
    //      .scaleExtent([1, 20])
    //      .on("zoom", zoomed);

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
              //console.log(d.properties.name)
              let name=d.properties.name;
              
            const value=populationData.find((item)=>{
                return(item["Country Name"]===name)
            })
            
            if(value)
            {
            if(funct(value)){
                return ("red");
            }else
              return ("grey")
            }else{
                return ("black")
            }
          })
           .attr("stroke","black")
            .on("mouseover",function(d) {
              
                //gettting the name of state and its details
                let name=d.properties.name;

             //finding data
            const value=populationData.find((item)=>{
                return(item["Country Name"]===name)
            })
            // console.log(value)
                //Get this bar's x/y values, then augment for the tooltip
                var xPosition = parseFloat(event.pageX+30);
                var yPosition = parseFloat(event.pageY-20);
                //Update the tooltip position and value
                d3.select("#tooltip")
                  .style("left", xPosition + "px")
                  .style("top", yPosition + "px");
                d3.select("#tooltip #heading")
                  .text("name :" +value["Country Name"]);
                d3.select("#tooltip #population")
                  .text("Area:"+value["2020"]);
                d3.select("#tooltip #area")
                  .text("Country code:" +value["Country Code"]);
          
          
          
                //Show the tooltip
                d3.select("#tooltip").classed("hidden", false);
          
                d3.select(this.parentNode.appendChild(this))
                 //.transition()
                 //.duration(100)
                  .style({'stroke-width':1,'stroke':'#333','stroke-linejoin':'round',
                          'stroke-linecap': 'round', 'cursor':'pointer'});
            })
            .on('mouseout',function(countyDataItem){
              
              d3.select("#tooltip").classed("hidden", true);
            //   tooltip.transition()
            //       .classed('visibility','hidden') 
          })

          
           

 }
 d3.json(nepalUrl).then(
    (data, error) => {
        if(error){
            console.log(error)
        }else{
           // console.log(data)
           nepalData = topojson.feature(data, data.objects.countries);
           
            nepalData =nepalData.features;
            // console.log('Nepal Data')
            console.log(nepalData)
            for(let i=0;i<177;i++){
                characters[i]=nepalData[i].properties.name;
            }
            characters.sort();
            console.log(characters)
            

            d3.csv(populationUrl).then(
                (data, error) => {
                    if(error){
                        console.log(error)
                    }
                    else{
                        populationData = data
                        // console.log('Education Data')
                        console.log(populationData)
                    //     const value=populationData.find((item)=>{
                    //         return(item["Country Name"]==="Nepal")
                    //     })
                    //    nepalarea=value["2020"];
                    //    console.log(nepalarea)
                    }
                     drawMap()
                }
            )

        }
    }
)