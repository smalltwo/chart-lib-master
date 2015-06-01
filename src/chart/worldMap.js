'use strict'

/**
 * @description 世界地图的绘制
 * @dete 2015.04.28
 * @version 0.1
 */
function worldMap(svg, data) {
    
    this.data = data
    this.width = null
    this.height = null
    this.id = null
    this.svg = svg

    this.events = {}

    var that = this

    this.draw = function() {

        var style = getComputedStyle(this.svg)
        // 获取伪类样式
        var hoverStyle = getComputedStyle(this.svg, ':hover')

        // TODO: 250和130是试出来的magic number
        var projection = d3.geo.equirectangular()
            .scale(250)
            .translate([that.width / 2, that.height / 2 - 130])
            .precision(.1);

        var path = d3.geo.path()
            .projection(projection)

        var graticule = d3.geo.graticule()

        var svg = d3.select(that.svg)
        var world = that.data

        svg.attr('version', '1.1')
        svg.attr('xmlns', 'http://www.w3.org/1999/svg')

        svg.attr('width', that.width)
            .attr('height', that.height)

        if (world !== null) {

            var countries = topojson.feature(world, world.objects.countries).features,
                neighbors = topojson.neighbors(world.objects.countries.geometries)

            svg.selectAll('path')
                .data(countries)
                .enter()
                .insert('path', '.graticule')
                .attr('class', 'country')
                .attr('d', path)
                .style('fill', style.fill)
                .style('stroke', style.stroke)
                .style('stroke-width', style.strokeWidth)
                .attr('data-id', function(d) {

                    return d.id
                })
                .attr('data-d', function(d) {

                    return d
                })
                .attr('data-i', function(d, i) {

                    return i
                })

            svg.insert('path', '.graticule')
                .datum(topojson.mesh(world, world.objects.countries, function(a, b) {
                    return a !== b;
                }))
                .attr('class', 'boundary')
                .style('stroke', style.stroke)
                .style('stroke-width', style.strokeWidth)
                .attr('d', path)


            // 调用一个通用的绑定事件函数，传入这个图标的selector，遍历所有事件进行绑定

        }

        d3.select(self.frameElement).style('height', that.height + 'px')   
    }
}