import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart } from '@mui/x-charts/LineChart';

const Graph = () => {
  const userUuid = localStorage.getItem('userUuid');
  const [seriesData1, setSeriesData1] = useState([]);
  const [seriesData2, setSeriesData2] = useState([]);
  const [xAxisData1, setXAxisData1] = useState([]);
  const [xAxisData2, setXAxisData2] = useState([]);
  const [conditions, setConditions] = useState({
    bodyweight: false,
    height: false,
    musclemass: true,
    fatfreemass: true,
    bodyfatpercentage: true,
    fatmass: true,
    basalmetabolicrate: false,
  });
  const [showChart1, setShowChart1] = useState(true);

  const toggleCondition = (label) => {
    setConditions((prevConditions) => ({
      ...prevConditions,
      [label]: !prevConditions[label],
    }));
  };

  const fetchData = async () => {
    try {
      const inbodyResponse = await axios.get(`http://localhost:8080/api/v1/inbody/all/${userUuid}`);
      const allData = inbodyResponse.data;

      // 2024년 데이터만 필터링
      const filteredData = allData.filter(item => new Date(item.createdAt).getFullYear() === 2024);

      // 각 월별로 가장 최신 데이터를 추출
      const monthlyData = Array.from({ length: 12 }, (_, i) => {
        const monthData = filteredData.filter(item => new Date(item.createdAt).getMonth() === i);
        if (monthData.length > 0) {
          return monthData.reduce((latest, item) => {
            return new Date(item.createdAt) > new Date(latest.createdAt) ? item : latest;
          });
        }
        return null;
      });

      // X축 데이터 (1부터 12까지 모든 월 포함)
      const xAxis1 = Array.from({ length: 12 }, (_, i) => i + 1);

      // 7개의 데이터 시리즈를 생성하고 빈 값은 null로 채움
      const bodyWeightSeries1 = { label: 'Body Weight', data: monthlyData.map(item => item ? (isNaN(item.bodyWeight) ? null : item.bodyWeight) : null) };
      const heightSeries1 = { label: 'Height', data: monthlyData.map(item => item ? (isNaN(item.height) ? null : item.height) : null) };
      const muscleMassSeries1 = { label: 'Muscle Mass', data: monthlyData.map(item => item ? (isNaN(item.muscleMass) ? null : item.muscleMass) : null) };
      const fatFreeMassSeries1 = { label: 'Fat Free Mass', data: monthlyData.map(item => item ? (isNaN(item.fatFreeMass) ? null : item.fatFreeMass) : null) };
      const bodyFatPercentageSeries1 = { label: 'Body Fat Percentage', data: monthlyData.map(item => item ? (isNaN(item.bodyFatPercentage) ? null : item.bodyFatPercentage) : null) };
      const fatMassSeries1 = { label: 'Fat Mass', data: monthlyData.map(item => item ? (isNaN(item.fatMass) ? null : item.fatMass) : null) };
      const basalMetabolicRateSeries1 = { label: 'Basal Metabolic Rate', data: monthlyData.map(item => item ? (isNaN(item.basalMetabolicRate) ? null : item.basalMetabolicRate) : null) };

      // 최신 10개의 데이터 추출
      const recentData = filteredData
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 10)
        .reverse();

      // 날짜를 그룹화하여 중복된 날짜에 인덱스를 추가
      const dateMap = {};
      const xAxis2 = recentData.map(item => {
        const dateStr = new Date(item.createdAt).toLocaleDateString('ko-KR', { year: 'numeric', month: 'numeric', day: 'numeric' });
        if (dateMap[dateStr]) {
          dateMap[dateStr] += 1;
          return `${dateStr} (${dateMap[dateStr]})`;
        } else {
          dateMap[dateStr] = 1;
          return dateStr;
        }
      });

      // 7개의 데이터 시리즈를 생성하고 빈 값은 null로 채움
      const bodyWeightSeries2 = { label: 'Body Weight', data: recentData.map(item => item ? (isNaN(item.bodyWeight) ? null : item.bodyWeight) : null) };
      const heightSeries2 = { label: 'Height', data: recentData.map(item => item ? (isNaN(item.height) ? null : item.height) : null) };
      const muscleMassSeries2 = { label: 'Muscle Mass', data: recentData.map(item => item ? (isNaN(item.muscleMass) ? null : item.muscleMass) : null) };
      const fatFreeMassSeries2 = { label: 'Fat Free Mass', data: recentData.map(item => item ? (isNaN(item.fatFreeMass) ? null : item.fatFreeMass) : null) };
      const bodyFatPercentageSeries2 = { label: 'Body Fat Percentage', data: recentData.map(item => item ? (isNaN(item.bodyFatPercentage) ? null : item.bodyFatPercentage) : null) };
      const fatMassSeries2 = { label: 'Fat Mass', data: recentData.map(item => item ? (isNaN(item.fatMass) ? null : item.fatMass) : null) };
      const basalMetabolicRateSeries2 = { label: 'Basal Metabolic Rate', data: recentData.map(item => item ? (isNaN(item.basalMetabolicRate) ? null : item.basalMetabolicRate) : null) };

      setSeriesData1([
        bodyWeightSeries1,
        heightSeries1,
        muscleMassSeries1,
        fatFreeMassSeries1,
        bodyFatPercentageSeries1,
        fatMassSeries1,
        basalMetabolicRateSeries1
      ]);

      setSeriesData2([
        bodyWeightSeries2,
        heightSeries2,
        muscleMassSeries2,
        fatFreeMassSeries2,
        bodyFatPercentageSeries2,
        fatMassSeries2,
        basalMetabolicRateSeries2
      ]);

      setXAxisData1(xAxis1);
      setXAxisData2(xAxis2);

      // 로그를 추가하여 데이터 확인
      console.log('Chart 1 Data:', { seriesData1, xAxisData1 });
      console.log('Chart 2 Data:', { seriesData2, xAxisData2 });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [userUuid]);

  const filteredSeriesData1 = seriesData1.filter(series => conditions[series.label.replace(/\s+/g, '').toLowerCase()]);
  const filteredSeriesData2 = seriesData2.filter(series => conditions[series.label.replace(/\s+/g, '').toLowerCase()]);

  return (
    <section className="text-gray-600 body-font relative bg-white flex items-center justify-center">
      <div className="flex items-center">
        {showChart1 ? (
          <LineChart
            series={filteredSeriesData1}
            xAxis={[{ data: xAxisData1, visible: false }]}
            width={800}
            height={600}
            lineProps={{
              strokeWidth: 2 // 모든 라인에 대한 기본 스트로크 두께
            }}
          />
        ) : (
          <LineChart
            series={filteredSeriesData2}
            xAxis={[{ scaleType: 'point', data: xAxisData2, visible: true }]}
            width={800}
            height={600}
            lineProps={{
              strokeWidth: 2 // 모든 라인에 대한 기본 스트로크 두께
            }}
          />
        )}
        <div className="flex flex-col ml-4">
          {Object.keys(conditions).map((key) => (
            <button
              key={key}
              onClick={() => toggleCondition(key)}
              className={`py-2 px-4 mb-2 w-40 rounded border-2 ${
                conditions[key] ? 'bg-[#3B7666] text-white border-[#3B7666]' : 'bg-white text-[#3B7666] border-[#3B7666]'
              }`}
            >
              {key === 'bodyweight' && '체중'}
              {key === 'height' && '키'}
              {key === 'musclemass' && '근육량'}
              {key === 'fatfreemass' && '제지방량'}
              {key === 'bodyfatpercentage' && '체지방률'}
              {key === 'fatmass' && '체지방량'}
              {key === 'basalmetabolicrate' && '기초대사량'}
            </button>
          ))}
          <button
            onClick={() => setShowChart1(!showChart1)}
            className="py-2 px-4 mb-2 w-40 rounded border-2 bg-blue-500 text-white border-blue-500"
          >
            {showChart1 ? '최신 변화 추이' : '월별 최신 데이터'}
          </button>
        </div>
      </div>
    </section>
  );
};

export default Graph;
