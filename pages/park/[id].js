import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import styles from "@/styles/Park.module.css";
import parksData from "@/public/address.json";

export default function ParkDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [parkData, setParkData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterMode, setFilterMode] = useState("all"); // 'all' 또는 'operating'

  useEffect(() => {
    if (!id) return;

    const fetchParkData = async () => {
      try {
        // address.json에서 놀이공원 이름 찾기 (새로운 구조에 맞게 수정)
        const parkInfo = Object.entries(parksData).reduce(
          (acc, [country, parks]) => {
            const foundPark = parks.find((p) => p.id === parseInt(id));
            if (foundPark) {
              acc.name = foundPark.name;
              acc.company = foundPark.company;
              acc.country = country;
            }
            return acc;
          },
          { name: "Error", company: "", country: "" }
        );

        const response = await fetch(`/api/park/${id}`);
        if (!response.ok) throw new Error("데이터를 불러오는데 실패했습니다");
        const data = await response.json();

        // API 응답 구조에 맞게 데이터 처리
        setParkData({
          name: parkInfo.name,
          company: parkInfo.company,
          country: parkInfo.country,
          lands: data.lands || [],
          rides: [
            ...(data.lands || []).flatMap((land) => land.rides || []),
            ...(data.rides || []),
          ],
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchParkData();
    const interval = setInterval(fetchParkData, 300000);
    return () => clearInterval(interval);
  }, [id]);

  if (loading) return <div className={styles.container}>로딩 중...</div>;
  if (error) return <div className={styles.container}>에러: {error}</div>;
  if (!parkData)
    return <div className={styles.container}>데이터가 없습니다</div>;

  // 운영 상태에 따라 정렬 및 필터링
  const sortedAndFilteredRides = parkData.rides
    .filter(
      (ride) =>
        filterMode === "all" || (filterMode === "operating" && ride.is_open)
    )
    .sort((a, b) => {
      if (a.is_open === b.is_open) {
        // 대기 시간이 긴 순서로 정렬
        return b.wait_time - a.wait_time;
      }
      // 운영 중인 놀이기구를 먼저 표시
      return b.is_open - a.is_open;
    });

  const operatingCount = parkData.rides.filter((ride) => ride.is_open).length;

  const CircularProgress = ({ total, operating }) => {
    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    const percentage = (operating / total) * 100;
    const offset = circumference - (percentage / 100) * circumference;

    return (
      <div className={styles.progressContainer}>
        <div className={styles.progressWrapper}>
          <svg className={styles.progressRing} width="120" height="120">
            <circle
              className={styles.progressRingCircle}
              stroke="#f0f0f0"
              strokeWidth="8"
              fill="transparent"
              r={radius}
              cx="60"
              cy="60"
            />
            <circle
              className={styles.progressRingCircle}
              stroke="#2ecc71"
              strokeWidth="8"
              fill="transparent"
              r={radius}
              cx="60"
              cy="60"
              style={{
                strokeDasharray: circumference,
                strokeDashoffset: offset,
                strokeLinecap: "round",
              }}
            />
          </svg>
          <div className={styles.progressCenter}>
            <span className={styles.progressPercentage}>
              {Math.round(percentage)}%
            </span>
            <span className={styles.progressNumbers}></span>
          </div>
        </div>
        <div className={styles.progressLabel}>
          전체: {total} / 운영: {operating}
        </div>
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.headerWrap}>
        <button onClick={() => router.push("/")} className={styles.backButton}>
          ← 메인으로 돌아가기
        </button>
        <h1 className={styles.title}>{parkData.name}</h1>
        {parkData.company && (
          <div className={styles.parkInfo}>
            <h2 className={styles.subtitle}>{parkData.company}</h2>
            <span className={styles.country}>{parkData.country}</span>
          </div>
        )}
      </div>

      <div className={styles.statsContainer}>
        <CircularProgress
          total={parkData.rides.length}
          operating={operatingCount}
        />
        <div className={styles.filterButtons}>
          <button
            className={`${styles.filterButton} ${
              filterMode === "all" ? styles.active : ""
            }`}
            onClick={() => setFilterMode("all")}
          >
            전체 보기
          </button>
          <button
            className={`${styles.filterButton} ${
              filterMode === "operating" ? styles.active : ""
            }`}
            onClick={() => setFilterMode("operating")}
          >
            운영 중만 보기
          </button>
        </div>
      </div>

      {sortedAndFilteredRides.length === 0 ? (
        <p className={styles.noData}>
          {filterMode === "operating"
            ? "현재 운영 중인 놀이기구가 없습니다."
            : "이용 가능한 놀이기구 정보가 없습니다."}
        </p>
      ) : (
        <div className={styles.grid}>
          {sortedAndFilteredRides.map((ride) => (
            <div
              key={ride.id}
              className={`${styles.card} ${!ride.is_open ? styles.closed : ""}`}
            >
              <h3>{ride.name}</h3>
              <div className={styles.info}>
                <p className={styles.status}>
                  상태:{" "}
                  <span className={ride.is_open ? styles.open : styles.closed}>
                    {ride.is_open ? "운영 중" : "운영 종료"}
                  </span>
                </p>
                <p className={styles.waitTime}>
                  대기 시간: <strong>{ride.wait_time}분</strong>
                </p>
                <p className={styles.updateTime}>
                  {new Date(ride.last_updated).toLocaleString("ko-KR")}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
