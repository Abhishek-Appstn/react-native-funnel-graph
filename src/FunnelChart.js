import React from 'react';
import { View } from 'react-native';
import Svg, { Path, G, Line, Text as SvgText, Ellipse } from 'react-native-svg';

interface ColorSet {
    /** Color for the side of the funnel segment */
    side?: string;
    /** Color for the top ellipse of the funnel segment */
    top?: string;
}

interface FunnelDataItem {
    /** 
     * Numeric value that determines the height of this segment 
     * @example 100 // For a full height segment
     */
    value: number;
    /** 
     * Text label to display inside the segment 
     * @example 'Visits' // Label for the segment
     */
    label: string;
    /** 
     * Color customization for this segment 
     * @example { side: '#4e73df', top: '#2e59d9' } // Blue color scheme
     */
    colors?: ColorSet;
    /** 
     * Color for the text label inside this segment 
     * @example '#FFFFFF' // White text
     */
    textColor?: string;
}

interface ConeStackProps {
    yOffset: number;
    color?: ColorSet;
    topWidth: number;
    bottomWidth: number;
    height: number;
    centerX: number;
    bottleneckHeight?: number;
}

interface FunnelChartProps {
    /** 
     * Total width of the chart container 
     * @default 350
     * @example 400 // For a wider chart
     */
    width?: number;
    /** 
     * Total height of the chart container 
     * @default 200
     * @example 300 // For a taller chart
     */
    height?: number;
    /** 
     * Data for the funnel segments 
     * @example
     * [
     *   { value: 100, label: 'Visits', colors: { side: '#4e73df', top: '#2e59d9' } },
     *   { value: 80, label: 'Signups', colors: { side: '#1cc88a', top: '#17a673' } }
     * ]
     */
    data?: FunnelDataItem[];
    /** 
     * Interval for Y-axis labels (in percentage points)
     * @default 25
     * @example 20 // Will show 0%, 20%, 40%, 60%, 80%, 100%
     */
    yAxisInterval?: number;
    /** 
     * Maximum width of the funnel (as ratio of available width) 
     * @default 0.85
     * @example 0.9 // For a wider funnel top
     */
    maxFunnelWidthRatio?: number;
    /** 
     * Minimum width of the funnel (as ratio of available width) 
     * @default 0.2
     * @example 0.1 // For a narrower funnel bottom
     */
    minFunnelWidthRatio?: number;
}

const ConeStack: React.FC<ConeStackProps> = ({
    yOffset,
    color = {},
    topWidth,
    bottomWidth,
    height,
    centerX,
    bottleneckHeight = 0,
}) => {
    const ellipseHeight = 22.7;
    const ellipseBaseRx = 177.073 / 2;
    const ellipseScaleX = topWidth > 0 ? topWidth / (ellipseBaseRx * 2) : 0;
    const sideStartY = ellipseHeight / 2;

    // Blue color scheme with darker shade for ellipse
    const sideColor = color.side || '#9ED68A';
    const topColor = color.top || '#C5E1A5';

    const sidePath = bottleneckHeight > 0
        ? `M ${-topWidth / 2},${sideStartY}
       L ${-bottomWidth / 2},${sideStartY + height}
       L ${-bottomWidth / 2},${sideStartY + height + bottleneckHeight}
       L ${bottomWidth / 2},${sideStartY + height + bottleneckHeight}
       L ${bottomWidth / 2},${sideStartY + height}
       L ${topWidth / 2},${sideStartY}
       Z`
        : `M ${-topWidth / 2},${sideStartY}
       L ${-bottomWidth / 2},${sideStartY + height}
       L ${bottomWidth / 2},${sideStartY + height}
       L ${topWidth / 2},${sideStartY}
       Z`;

    return (
        <G transform={`translate(${centerX}, ${yOffset})`}>
            <Path d={sidePath} fill={sideColor} />
            <G transform={`scale(${ellipseScaleX}, 1)`}>
                <Ellipse
                    cx={0}
                    cy={sideStartY}
                    rx={ellipseBaseRx}
                    ry={ellipseHeight / 2}
                    fill={topColor}
                />
            </G>
        </G>
    );
};

/**
 * A customizable funnel chart component for React Native with blue color scheme
 * 
 * @example
 * // Basic usage with default blue colors
 * <FunnelChart data={[
 *   { value: 100, label: 'Visits' },
 *   { value: 80, label: 'Signups' }
 * ]} />
 * 
 * @example
 * // Custom styled funnel with different intervals
 * <FunnelChart 
 *   width={400}
 *   height={300}
 *   data={[
 *     { value: 100, label: 'Impressions' },
 *     { value: 75, label: 'Clicks' }
 *   ]}
 *   yAxisInterval={20}
 * />
 */
const FunnelChart: React.FC<FunnelChartProps> = ({
    width = 350,
    height = 200,
    data = [],
    yAxisInterval = 25,
    maxFunnelWidthRatio = 0.85,
    minFunnelWidthRatio = 0.2,
}) => {
    // Calculate labels based on interval
    const yAxisLabels = React.useMemo(() => {
        const interval = yAxisInterval;
        const labels = [];
        for (let i = 100; i >= 0; i -= interval) {
            labels.push(`${i}%`);
        }
        if (100 % interval !== 0 && !labels.includes('0%')) {
            labels.push('0%');
        }
        return labels.sort((a, b) => parseInt(b) - parseInt(a));
    }, [yAxisInterval]);

    // Chart layout constants
    const yAxisAreaWidth = 50;
    const paddingTop = 10;
    const paddingBottom = 20;
    const chartWidth = width - yAxisAreaWidth;
    const availableChartHeight = height - paddingTop - paddingBottom;
    const funnelCenterX = chartWidth / 2;
    const ellipseHeight = 22.7;

    // Calculate the max value from data or use 100 as default
    const maxValue = data[0]?.value || 100;
    const heightPerValue = availableChartHeight / maxValue;

    const hasData = data && data.length > 0;

    // Pre-calculate properties for each funnel segment
    const segments = React.useMemo(() => {
        if (!hasData) return [];

        const bottleneckStartValue = 20;
        const totalTaperedHeight = Math.max(0, (maxValue - bottleneckStartValue) * heightPerValue);

        let currentY = paddingTop - (ellipseHeight / 2);
        let cumulativeHeight = 0;

        return data?.map((item, index) => {
            const itemValue = item.value || 0;
            const itemLabel = item.label || '';
            const nextValue = data[index + 1]?.value || bottleneckStartValue;

            if (itemValue <= nextValue) return null;

            const topProgress = totalTaperedHeight > 0 ? cumulativeHeight / totalTaperedHeight : 0;
            const coneHeight = (itemValue - nextValue) * heightPerValue;
            const bottomProgress = totalTaperedHeight > 0 ? (cumulativeHeight + coneHeight) / totalTaperedHeight : 0;

            const topWidth = chartWidth * maxFunnelWidthRatio - topProgress * (chartWidth * maxFunnelWidthRatio - chartWidth * minFunnelWidthRatio);
            const bottomWidth = chartWidth * maxFunnelWidthRatio - bottomProgress * (chartWidth * maxFunnelWidthRatio - chartWidth * minFunnelWidthRatio);

            const yOffset = currentY;
            currentY += coneHeight;
            cumulativeHeight += coneHeight;

            const fontSizeFromWidth = bottomWidth / (itemLabel.length * 0.7);
            const fontSizeFromHeight = coneHeight * 0.4;
            const fontSize = Math.min(14, Math.max(8, Math.min(fontSizeFromWidth, fontSizeFromHeight)));

            return { ...item, topWidth, bottomWidth, coneHeight, yOffset, fontSize, label: itemLabel };
        }).filter(Boolean);
    }, [data, hasData, maxValue, heightPerValue, chartWidth, maxFunnelWidthRatio, minFunnelWidthRatio, paddingTop]);

    const bottleneckHeight = hasData
        ? 20 * heightPerValue
        : 0;

    return (
        <View style={{ width, height, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', padding: 10 }}>
            <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
                {hasData && (
                    <G>
                        {yAxisLabels?.map((label, index) => {
                            const percentage = parseInt(label);
                            const yPos = paddingTop + (availableChartHeight * (1 - percentage / 100));
                            return (
                                <G key={`y-axis-${index}`}>
                                    <Line x1={0} y1={yPos} x2={width} y2={yPos} stroke="#EAEAEA" strokeDasharray="4,4" />
                                    <SvgText x={yAxisAreaWidth - 10} y={yPos} dy="4" fill="#888" fontSize={12} textAnchor="end" alignmentBaseline="hanging">
                                        {label}
                                    </SvgText>
                                </G>
                            );
                        })}
                    </G>
                )}

                <G transform={`translate(${yAxisAreaWidth}, 0)`}>
                    {hasData && (
                        <>
                            {segments?.map((segment, index) => {
                                const isLastSegment = index === segments.length - 1;
                                return (
                                    <ConeStack
                                        key={`cone-${index}`}
                                        yOffset={segment.yOffset}
                                        color={segment.colors}
                                        topWidth={segment.topWidth}
                                        bottomWidth={segment.bottomWidth}
                                        height={segment.coneHeight}
                                        centerX={funnelCenterX}
                                        bottleneckHeight={isLastSegment ? bottleneckHeight : 0}
                                    />
                                );
                            })}

                            {segments?.map((segment, index) => {
                                const labelY = segment.yOffset + (ellipseHeight / 2) + (segment.coneHeight / 2);
                                return (
                                    <SvgText
                                        key={`label-${index}`}
                                        x={funnelCenterX}
                                        y={labelY}
                                        fill={segment.textColor || '#000'}
                                        fontSize={segment.fontSize}
                                        fontWeight="500"
                                        textAnchor="middle"
                                        alignmentBaseline="middle"
                                    >
                                        {segment?.label}
                                    </SvgText>
                                );
                            })}
                        </>
                    )}
                </G>
            </Svg>
        </View>
    );
};

export default FunnelChart;