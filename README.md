```markdown
# react-native-funnel-graph 📊

[![npm version](https://img.shields.io/npm/v/react-native-funnel-graph.svg?style=flat)](https://www.npmjs.com/package/react-native-funnel-graph)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)

A high-performance SVG funnel chart component for React Native with beautiful gradients and automatic percentage labels.

![Funnel Examples](https://raw.githubusercontent.com/Abhishek-Appstn/react-native-funnel-graph/main/assets/example/image/exampleimage.png)
![iOS Example](https://raw.githubusercontent.com/Abhishek-Appstn/react-native-funnel-graph/main/assets/example/image/ExampleIos.png)
![Example 2](https://raw.githubusercontent.com/Abhishek-Appstn/react-native-funnel-graph/main/assets/example/image/Graph%202.png)
![Example 3](https://raw.githubusercontent.com/Abhishek-Appstn/react-native-funnel-graph/main/assets/example/image/Graph3.png)

## Features ✨

- 🎨 Beautiful blue gradient default theme
- 📏 Automatic Y-axis percentage labels
- 🔍 Perfectly responsive at any size
- ✏️ Fully customizable colors and styles
- 🚀 Optimized for smooth performance
- 📱 Works on both iOS and Android

## Installation 💻

```bash
npm install react-native-funnel-graph
# or
yarn add react-native-funnel-graph
```

For iOS:
```bash
cd ios && pod install && cd ..
```

## Basic Usage 🚀

```jsx
import React from 'react';
import { View } from 'react-native';
import FunnelChart from 'react-native-funnel-graph';

const App = () => {
  const funnelData = [
    {
      value: 100,
      label: 'Impressions',
      colors: { side: '#FFB179', top: '#FFD4B2' },
      textColor: '#A05822',
    },
    {
      value: 50,
      label: 'Clicks',
      colors: { side: '#FF8A65', top: '#FFAB91' },
      textColor: '#B71C1C',
    }
  ];

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <FunnelChart 
        data={funnelData}
        yAxisInterval={20} // Shows 0%, 20%, 40%, 60%, 80%, 100%
        width={350}
        height={400}
      />
    </View>
  );
};
```

## Props 🔧

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| **data** | Array | Required | Funnel segments data |
| width | number | 350 | Chart width (px) |
| height | number | 200 | Chart height (px) |
| yAxisInterval | number | 25 | Y-axis label interval |
| maxFunnelWidthRatio | number | 0.85 | Top width ratio |
| minFunnelWidthRatio | number | 0.2 | Bottom width ratio |

### Data Format

```javascript
{
  value: number,       // Required
  label: string,       // Required
  colors?: {           // Optional
    side?: string,     // Default: '#9ED68A'
    top?: string       // Default: '#C5E1A5'
  },
  textColor?: string   // Default: '#FFFFFF'
}
```

## Examples 🎨

### Custom Colors
```jsx
<FunnelChart
  data={[
    {
      value: 100,
      label: 'Visitors',
      colors: { side: '#FF7043', top: '#FF8A65' }
    }
  ]}
/>
```

### Different Interval
```jsx
<FunnelChart
  yAxisInterval={20}  // Shows 0%, 20%, 40%, etc.
  data={data}
/>
```

## Troubleshooting 🔍

**Chart not showing?**
- Run `pod install` for iOS
- Check Metro server is running
- Verify valid data structure

**Text cut off?**
- Increase chart width
- Shorten labels
- Adjust minFunnelWidthRatio

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue at the [GitHub repository](https://github.com/Abhishek-Appstn/react-native-funnel-graph) if you find a bug or have a feature request.

## License 📄

ISC License © Abhishek ML
```

This version includes:

1. All visual examples from your repository
2. Simplified installation instructions
3. Complete props documentation
4. Ready-to-use code examples
5. Troubleshooting guide
6. Professional formatting
7. License information

The file is optimized for:
- GitHub rendering
- npmjs.com display
- Mobile readability
- Easy copying/pasting
