package com.seatify.backend.domain.congestion.service;

import com.seatify.backend.api.congestion.dto.HourlyCongestionDTO;
import com.seatify.backend.api.seat.dto.SeatResponseDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Service;

import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.DayOfWeek;
import java.time.LocalDateTime;
import java.time.format.TextStyle;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class CongestionService {

    private final ResourceLoader resourceLoader;

    @Value("${congestion.csv-path}")
    private String csvPath; // 예: data/cafe_congestion.csv

    private Path getCsvPath() {
        return Path.of(csvPath).toAbsolutePath(); // 로그로 확인 가능
    }

    public List<HourlyCongestionDTO> getPredictionsFromCsv(Long cafeId, String day) {
        List<CSVRecord> records = loadCsvRecords();

        List<CSVRecord> filtered = records.stream()
                .filter(r -> r.getCafeId().equals(cafeId.toString()) && r.getDayOfWeek().equalsIgnoreCase(day))
                .collect(Collectors.toList());

        Map<Integer, List<CSVRecord>> grouped = filtered.stream()
                .collect(Collectors.groupingBy(CSVRecord::getHour));

        int currentHour = LocalDateTime.now().getHour();
        List<HourlyCongestionDTO> result = new ArrayList<>();

        for (int hour = 9; hour <= 23; hour++) {
            List<CSVRecord> entries = grouped.get(hour);
            if (entries == null || entries.isEmpty()) continue;

            double avgRatio = entries.stream()
                    .mapToDouble(e -> (double) (e.getSeatTotal() - e.getSeatVacant()) / e.getSeatTotal())
                    .average()
                    .orElse(0.0);

            int percentage = (int) Math.round(avgRatio * 100);
            String status = getStatus(percentage);

            result.add(HourlyCongestionDTO.builder()
                    .hour(hour)
                    .percentage(percentage)
                    .status(status)
                    .isCurrent(hour == currentHour)
                    .isPast(hour < currentHour)
                    .build());
        }

        return result;
    }

    private List<CSVRecord> loadCsvRecords() {
        log.info("사용 중인 CSV 경로: {}", getCsvPath());

        List<CSVRecord> records = new ArrayList<>();

        try (BufferedReader reader = new BufferedReader(new FileReader(csvPath))) {
            String line;
            boolean isFirstLine = true;

            while ((line = reader.readLine()) != null) {
                if (isFirstLine) {
                    isFirstLine = false;
                    continue;
                }

                String[] tokens = line.split(",");
                if (tokens.length < 5) continue;

                records.add(new CSVRecord(
                        tokens[0].trim(),
                        tokens[1].trim(),
                        Integer.parseInt(tokens[2].trim()),
                        Integer.parseInt(tokens[3].trim()),
                        Integer.parseInt(tokens[4].trim())
                ));
            }
        } catch (Exception e) {
            log.error("CSV 파일 읽기 실패", e);
        }

        return records;
    }

    private String getStatus(int percentage) {
        if (percentage > 70) return "BUSY";
        else if (percentage > 30) return "AVERAGE";
        else return "SPARE";
    }

    private static class CSVRecord {
        private final String cafeId;
        private final String dayOfWeek;
        private final int hour;
        private final int seatTotal;
        private final int seatVacant;

        public CSVRecord(String cafeId, String dayOfWeek, int hour, int seatTotal, int seatVacant) {
            this.cafeId = cafeId;
            this.dayOfWeek = dayOfWeek;
            this.hour = hour;
            this.seatTotal = seatTotal;
            this.seatVacant = seatVacant;
        }

        public String getCafeId() { return cafeId; }

        public String getDayOfWeek() { return dayOfWeek; }

        public int getHour() { return hour; }

        public int getSeatTotal() { return seatTotal; }

        public int getSeatVacant() { return seatVacant; }
    }
}
