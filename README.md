# D3-challenge
<img align="right" src="https://github.com/KristaJoy/D3-challenge/blob/main/assets/images/chart1.jpg">

Creating scatter plots utilizing html, D3, and javascript.

### Basic Scatter Chart
I created a basic scatter plot between two variables—the median household income and the percent of people who smoke—and plotted for each State. For more visual clarity, I plotted the State's abbreviation over the plot circles. 

### Interactive X-Axis
Next I wanted to create more of an interactive chart. One where we could see not only the household income plotted against a health measure, but also by age and pverty levels. I chose to plot against obesity in this chart. I also wanted to show the specificx data values when you hovered your mouse over the chart's plotted circles. 

<img align="left" src="https://github.com/KristaJoy/D3-challenge/blob/main/assets/images/chart2.jpg">

The logic solution is to create functions that would recalculate the x-axis to position the plot circles, the x-axis, the State abbreviations, and the tooltip labels upon a click event on the x-axis labels. It was challenging to figure out, but rewarding to see the interactive chart at the end of the coding.

### Analysis
On the first chart, smoking vs household income, it seems clear that the lower the median income is, the higher probability of being smokers. The highest median income state is Maryland and they have almost ten percentage points fewer smokers as the owest income state Missouri. Utah is a small outlier on the data, with the lowest rates of smokers, but can likely be explained through religious practices. 

On the second chart, we see a similar correlation between income and obesity levels. States like West Virginia, Arkansas, Kentucky, Missouri and more, seem to have similar higher levels of smoking and obesity rates and have similar low income and higher poverty rates. When age is accounted for, the obesity levels seem more connected to which State you live in. A 36-year-old in Colorado is about 21% of the time obese, but in Louisianna is almost 36% likely obese.
