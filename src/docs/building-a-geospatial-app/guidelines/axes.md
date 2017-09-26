# Don't: confuse with axes

React-Vis provides flexibility with axes including the possibility to have multiple vertical and horizontal axes on a chart. 
Presenting several series on the same chart, expressed in different units and relying on separate axes, is almost always a bad idea though.

<!-- INJECT:"GeospatialAppDontDualAxes" -->

There are few exceptions; however, most often, when two dissimilar series are presented on one chart, an argument is made in the name of space. 
With the same amount of space, it's possible to have two charts on top of each other though:

<!-- INJECT:"GeospatialAppDoTwoCharts" -->

If both charts are aligned, then it's already possible to see "how charts move together". To go further, we can use the interactive features of React-Vis to position a tooltip and a moving line:

<!-- INJECT:"GeospatialAppTwoCharts" -->
