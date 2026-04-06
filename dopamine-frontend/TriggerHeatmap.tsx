import React, { useMemo } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";

interface HeatmapCell {
  day: string;
  dayLetter: string;
  timeBucket: string;
  riskScore: number;
}

const generateMockData = (): HeatmapCell[] => {
  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  const dayLetters = ["M", "T", "W", "T", "F", "S", "S"];
  const timeBuckets = ["Morning", "Afternoon", "Evening", "Late Night"];

  const data: HeatmapCell[] = [];

  days.forEach((day, dayIndex) => {
    timeBuckets.forEach((timeBucket) => {
      let riskScore = Math.floor(Math.random() * 101);

      // Force Friday Late Night and Saturday Late Night > 85
      if (
        (day === "Friday" || day === "Saturday") &&
        timeBucket === "Late Night"
      ) {
        riskScore = Math.floor(Math.random() * 15) + 86; // 86-100
      }

      data.push({
        day,
        dayLetter: dayLetters[dayIndex],
        timeBucket,
        riskScore,
      });
    });
  });

  return data;
};

const getColorForScore = (score: number): string => {
  if (score <= 40) {
    return "rgba(124, 255, 45, 0.1)"; // Low
  } else if (score <= 70) {
    return "rgba(124, 255, 45, 0.4)"; // Medium
  } else {
    return "#7CFF2D"; // High
  }
};

const TriggerHeatmap: React.FC = () => {
  const data = useMemo(() => generateMockData(), []);

  const getRiskiestWindow = () => {
    const sorted = [...data].sort((a, b) => b.riskScore - a.riskScore);
    const highest = sorted[0];
    return `${highest.day} ${highest.timeBucket}`;
  };

  const riskiestWindow = getRiskiestWindow();
  const timeBuckets = ["Morning", "Afternoon", "Evening", "Late Night"];
  const dayLetters = ["M", "T", "W", "T", "F", "S", "S"];

  const getCellData = (
    timeBucket: string,
    dayLetter: string,
  ): HeatmapCell | undefined => {
    return data.find(
      (cell) => cell.timeBucket === timeBucket && cell.dayLetter === dayLetter,
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.gridContainer}>
        {/* Top row with day letters */}
        <View style={styles.gridRow}>
          <View style={styles.labelCell} />
          {dayLetters.map((letter, index) => (
            <View key={`${letter}-${index}`} style={styles.dayHeaderCell}>
              <Text style={styles.dayHeaderText}>{letter}</Text>
            </View>
          ))}
        </View>

        {/* Rows for each time bucket */}
        {timeBuckets.map((timeBucket, tbIndex) => (
          <View key={`${timeBucket}-${tbIndex}`} style={styles.gridRow}>
            <View style={styles.timeLabelCell}>
              <Text style={styles.timeLabelText}>{timeBucket}</Text>
            </View>
            {dayLetters.map((dayLetter, dlIndex) => {
              const cellData = getCellData(timeBucket, dayLetter);
              const backgroundColor = cellData
                ? getColorForScore(cellData.riskScore)
                : "rgba(124, 255, 45, 0.05)";

              return (
                <View
                  key={`${timeBucket}-${dayLetter}-${tbIndex}-${dlIndex}`}
                  style={[styles.dataCell, { backgroundColor }]}
                >
                  <Text style={styles.scoreText}>
                    {cellData?.riskScore ?? 0}
                  </Text>
                </View>
              );
            })}
          </View>
        ))}
      </View>

      {/* Legend */}
      <View style={styles.legendContainer}>
        <Text style={styles.legendTitle}>Risk Level</Text>
        <View
          style={[
            styles.legendRow,
            {
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "center",
            },
          ]}
        >
          <View
            style={[
              styles.legendItem,
              { marginHorizontal: 8, marginVertical: 4 },
            ]}
          >
            <View
              style={[
                styles.legendColor,
                { backgroundColor: "rgba(124, 255, 45, 0.1)" },
              ]}
            />
            <Text style={styles.legendLabel}>Low (0–40)</Text>
          </View>
          <View
            style={[
              styles.legendItem,
              { marginHorizontal: 8, marginVertical: 4 },
            ]}
          >
            <View
              style={[
                styles.legendColor,
                { backgroundColor: "rgba(124, 255, 45, 0.4)" },
              ]}
            />
            <Text style={styles.legendLabel}>Medium (41–70)</Text>
          </View>
          <View
            style={[
              styles.legendItem,
              { marginHorizontal: 8, marginVertical: 4 },
            ]}
          >
            <View
              style={[styles.legendColor, { backgroundColor: "#7CFF2D" }]}
            />
            <Text style={styles.legendLabel}>High (71–100)</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1E1E1E",
    paddingHorizontal: 16,
    paddingVertical: 24,
    borderRadius: 24,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 8,
    letterSpacing: -0.4,
  },
  riskiestWindow: {
    fontSize: 22,
    fontWeight: "700",
    color: "#7CFF2D",
    marginBottom: 28,
  },
  gridContainer: {
    marginBottom: 32,
  },
  gridRow: {
    flexDirection: "row",
    marginBottom: 8,
  },
  labelCell: {
    width: 110,
    height: 48,
  },
  dayHeaderCell: {
    flex: 1,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 3,
  },
  dayHeaderText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#A0A0A0",
  },
  timeLabelCell: {
    width: 110,
    height: 48,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  timeLabelText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#A0A0A0",
    lineHeight: 16,
  },
  dataCell: {
    flex: 1,
    height: 48,
    marginHorizontal: 3,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(124, 255, 45, 0.05)",
  },
  scoreText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  legendContainer: {
    paddingHorizontal: 12,
    paddingVertical: 16,
    backgroundColor: "#1A1A1A",
    borderRadius: 12,
    marginBottom: 24,
  },
  legendTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 12,
  },
  legendRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  legendColor: {
    width: 18,
    height: 18,
    borderRadius: 6,
    marginRight: 8,
  },
  legendLabel: {
    fontSize: 12,
    color: "#A0A0A0",
    fontWeight: "400",
  },
});

export default TriggerHeatmap;
