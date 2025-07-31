import React from 'react';
import { View } from 'react-native';
import Svg, { Path, G, Line, Text as SvgText, Ellipse } from 'react-native-svg';

const ConeStack = ({ yOffset, color = {}, topWidth, bottomWidth, height, centerX, bottleneckHeight = 0 }) => {
    const ellipseHeight = 22.7;
    const ellipseBaseRx = 177.073 / 2;
    const ellipseScaleX = topWidth > 0 ? topWidth / (ellipseBaseRx * 2) : 0;
    const sideStartY = ellipseHeight / 2;

    const sideColor = color.side || '#CCCCCC';
    const topColor = color.top || '#AAAAAA';

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

const FunnelChart = ({
    width = 350,
    height = 200,
    data = [],
    yAxisLabels = ['100%', '75%', '50%', '25%', '0%'],
    maxFunnelWidthRatio = 0.85,
    minFunnelWidthRatio = 0.2,
}) => {
    // Chart layout constants
    const yAxisAreaWidth = 50;
    const paddingTop = 10;
    const paddingBottom = 20;
    const chartWidth = width - yAxisAreaWidth;
    const availableChartHeight = height - paddingTop - paddingBottom;
    const funnelCenterX = chartWidth / 2;
    const ellipseHeight = 22.7;

    // Funnel dimension constants
    const bottleneckStartValue = 20;
    const maxFunnelWidth = chartWidth * maxFunnelWidthRatio;
    const minFunnelWidth = chartWidth * minFunnelWidthRatio;

    const hasData = data && data.length > 0;

    // Pre-calculate properties for each funnel segment
    const segments = React.useMemo(() => {
        if (!hasData) return [];

        const maxValue = data[0]?.value || 100;
        const heightPerValue = availableChartHeight / maxValue;
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

            const topWidth = maxFunnelWidth - topProgress * (maxFunnelWidth - minFunnelWidth);
            const bottomWidth = maxFunnelWidth - bottomProgress * (maxFunnelWidth - minFunnelWidth);

            const yOffset = currentY;
            currentY += coneHeight;
            cumulativeHeight += coneHeight;

            const fontSizeFromWidth = bottomWidth / (itemLabel.length * 0.7);
            const fontSizeFromHeight = coneHeight * 0.4;
            const fontSize = Math.min(14, Math.max(8, Math.min(fontSizeFromWidth, fontSizeFromHeight)));

            return { ...item, topWidth, bottomWidth, coneHeight, yOffset, fontSize, label: itemLabel };
        }).filter(Boolean);
    }, [data, hasData, availableChartHeight, maxFunnelWidth, minFunnelWidth, paddingTop]);

    const bottleneckHeight = hasData
        ? bottleneckStartValue * (availableChartHeight / (data[0]?.value || 100))
        : 0;

    return (
        <View style={{ width, height, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', padding: 10 }}>
            <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
                {hasData && (
                    <G>
                        {yAxisLabels?.map((label, index) => {
                            const yPos = index * (availableChartHeight / (yAxisLabels.length - 1)) + paddingTop;
                            return (
                                <G key={`y-axis-${index}`}>
                                    <Line x1={0} y1={yPos} x2={width} y2={yPos} stroke="#EAEAEA" strokeDasharray="4,4" />
                                    <SvgText x={yAxisAreaWidth - 10} y={yPos} dy="4" fill="#888" fontSize={12} textAnchor="end" alignmentBaseline="hanging">{label}</SvgText>
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
                                        yOffset={segment?.yOffset}
                                        color={segment?.colors}
                                        topWidth={segment?.topWidth}
                                        bottomWidth={segment?.bottomWidth}
                                        height={segment?.coneHeight}
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
                                        fontSize={segment?.fontSize}
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
