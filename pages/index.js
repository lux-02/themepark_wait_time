import { useState } from "react";
import Link from "next/link";
import styles from "@/styles/Home.module.css";
import parksData from "@/public/address.json";

// 국가별 국기 이모지 매핑
const countryFlags = {
  USA: "🇺🇸",
  Canada: "🇨🇦",
  China: "🇨🇳",
  France: "🇫🇷",
  Belgium: "🇧🇪",
  Netherlands: "🇳🇱",
  Germany: "🇩🇪",
  UK: "🇬🇧",
  Italy: "🇮🇹",
  Denmark: "🇩🇰",
  Brazil: "🇧🇷",
  Poland: "🇵🇱",
  Sweden: "🇸🇪",
  Spain: "🇪🇸",
  "South Korea": "🇰🇷",
  Mexico: "🇲🇽",
  "Hong Kong": "🇭🇰",
  Japan: "🇯🇵",
};

export default function Home() {
  const [selectedCountry, setSelectedCountry] = useState("all");
  const [selectedCompany, setSelectedCompany] = useState("all");

  // 모든 국가 목록
  const countries = Object.keys(parksData);

  // 모든 회사 목록 (중복 제거)
  const companies = [
    ...new Set(
      Object.values(parksData).flatMap((parks) =>
        parks.map((park) => park.company)
      )
    ),
  ].sort();

  // 필터링된 파크 데이터
  const getFilteredParks = () => {
    let filteredData = {};

    Object.entries(parksData).forEach(([country, parks]) => {
      if (selectedCountry !== "all" && country !== selectedCountry) return;

      const filteredParks = parks.filter(
        (park) => selectedCompany === "all" || park.company === selectedCompany
      );

      if (filteredParks.length > 0) {
        filteredData[country] = filteredParks;
      }
    });

    return filteredData;
  };

  const filteredParks = getFilteredParks();

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>전세계 놀이공원 대기시간</h1>

      <div className={styles.filters}>
        <select
          value={selectedCountry}
          onChange={(e) => setSelectedCountry(e.target.value)}
          className={styles.select}
        >
          <option value="all">모든 국가</option>
          {countries.map((country) => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </select>

        <select
          value={selectedCompany}
          onChange={(e) => setSelectedCompany(e.target.value)}
          className={styles.select}
        >
          <option value="all">모든 회사</option>
          {companies.map((company) => (
            <option key={company} value={company}>
              {company}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.grid}>
        {Object.entries(filteredParks).map(([country, parks]) => (
          <div key={country} className={styles.countrySection}>
            <h2 className={styles.countryTitle}>
              <span className={styles.countryFlag}>
                {countryFlags[country]}
              </span>
              {country}
              <span className={styles.parkCount}> ({parks.length})</span>
            </h2>
            <div className={styles.parkGrid}>
              {parks.map((park) => (
                <Link
                  href={`/park/${park.id}`}
                  key={park.id}
                  className={styles.card}
                >
                  <h3>{park.name}</h3>
                  <p className={styles.companyName}>{park.company}</p>
                  <p className={styles.viewMore}>자세히 보기 →</p>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export async function getStaticProps() {
  const parksData = require("../public/address.json");
  return {
    props: {
      parks: parksData,
    },
  };
}
