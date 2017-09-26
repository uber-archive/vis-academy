# Don't: too much to see

A frequent challenge is to try to represent too much data together. If you have a rich dataset, React-Vis can make it fit on a tiny area of the screen, however, that doesn't make it understandable.

For this example, we're going to represent the unemployment rates of all US states and territories (i.e that includes Puerto Rico and the district of Columbia.).

While we could create 52 time series, that doesn't work so well.

<!-- INJECT:"GeospatialAppTooMuch" -->

Our legend component is begging for mercy! It's not dimensioned for that many items. Besides, the default React-Vis palette has 20 different colors and will cycle through them unless another palette is specified.

That doesn't mean we can't show all the series at once. The only thing is, we can't show them distinctly as one chart.
Here are a few strategies to deal with that:

We could show only a few highlighted territories:

<!-- INJECT:"GeospatialAppNotTooMuch" -->

The chart remains highly legible as long as we don't try to make our user distinguish any 2 pairs of lines.

We could also use small multiples:

<!-- INJECT:"GeospatialAppSmallMultiples" -->

Or even make it look like a map: same idea as above - we make 52 mini-charts, but this time we simply position them absolutely in accordance to the approximate geographic position of the territory:

<!-- INJECT:"GeospatialAppSmallMultiplesMap" -->
