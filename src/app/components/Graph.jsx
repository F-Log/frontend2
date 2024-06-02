import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart } from '@mui/x-charts/LineChart';

const Graph = () => {
  const userUuid = localStorage.getItem('userUuid');
  const [seriesData, setSeriesData] = useState([]);
  const [xAxisData, setXAxisData] = useState([]);
  const [conditions, setConditions] = useState({
    bodyweight: false,
    height: false,
    musclemass: true,
    fatfreemass: true,
    bodyfatpercentage: true,
    fatmass: true,
    basalmetabolicrate: false,
  });

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
      const xAxis = Array.from({ length: 12 }, (_, i) => i + 1);

      // 7개의 데이터 시리즈를 생성하고 빈 값은 null로 채움
      const bodyWeightSeries = { label: 'Body Weight', data: monthlyData.map(item => item ? item.bodyWeight : null) };
      const heightSeries = { label: 'Height', data: monthlyData.map(item => item ? item.height : null) };
      const muscleMassSeries = { label: 'Muscle Mass', data: monthlyData.map(item => item ? item.muscleMass : null) };
      const fatFreeMassSeries = { label: 'Fat Free Mass', data: monthlyData.map(item => item ? item.fatFreeMass : null) };
      const bodyFatPercentageSeries = { label: 'Body Fat Percentage', data: monthlyData.map(item => item ? item.bodyFatPercentage : null) };
      const fatMassSeries = { label: 'Fat Mass', data: monthlyData.map(item => item ? item.fatMass : null) };
      const basalMetabolicRateSeries = { label: 'Basal Metabolic Rate', data: monthlyData.map(item => item ? item.basalMetabolicRate : null) };

      setSeriesData([
        bodyWeightSeries,
        heightSeries,
        muscleMassSeries,
        fatFreeMassSeries,
        bodyFatPercentageSeries,
        fatMassSeries,
        basalMetabolicRateSeries
      ]);
      setXAxisData(xAxis);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [userUuid]);

  const filteredSeriesData = seriesData.filter(series => conditions[series.label.replace(/\s+/g, '').toLowerCase()]);

  return (
    <section className="text-gray-600 body-font relative bg-white flex items-center justify-center">
      <div className="flex items-center">
        <LineChart
          series={filteredSeriesData}
          xAxis={[{ data: xAxisData }]}
          width={800}
          height={600}
          lineProps={{
            strokeWidth: 2 // 모든 라인에 대한 기본 스트로크 두께
          }}
        />
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
        </div>
      </div>
    </section>
  );
};

export default Graph;
