# Do: use hierarchy

When putting several charts on one screen, a very common pattern is to present everything at the same level:

<!-- INJECT:"GeospatialAppSameFourCharts" -->

Instead, consider this arrangement:

<!-- INJECT:"GeospatialAppHasHierarchy" -->

The information is the same and the charts display the exact same data. However, it's much more legible. 
In arranging these 4 charts, we chose the most important series and gave it extra prominence. 
The other series are just here to support and explain this main series. 

Here for instance, we see that night trips (between midnight and 6am) are longer, but they are fewer of them, which is why revenue during that time is lower. Conversely, there are more trips during 6 and 9pm, even though they are shorter, which is what explains that this period sees the highest revenue.

We don't need to provide full detail for the secondary series. Any more information that we display on the screen will compete with everything else.

To go further, we can add interaction that will link the charts together. If we have one overarching component, then we can expose its state to its children by passing them actions that will update that state. The values from that central state will also be passed to the children, so if the user interacts with any of the charts, that can be reflected on all of them:

<!-- INJECT:"GeospatialAppHasHierarchyInteractive" -->
