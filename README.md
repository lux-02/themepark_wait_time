# 🎡 전세계 놀이공원 대기시간 모니터링

실시간으로 전세계 주요 놀이공원의 대기시간을 확인할 수 있는 웹 애플리케이션입니다.

[themepark00.vercel.app](https://themepark00.vercel.app/)

## 🌟 주요 기능

### 1. 메인 페이지

- 국가별 놀이공원 목록 제공
- 국가 및 운영사 기준 필터링 기능
- 각 국가별 섹션에 국기 이모지와 보유 놀이공원 수 표시
- 직관적인 카드 형태의 UI로 놀이공원 정보 제공

### 2. 상세 페이지

- 실시간 놀이기구 대기시간 정보
- 운영/비운영 놀이기구 필터링 기능
- 원형 프로그레스 바를 통한 운영 현황 시각화
- 놀이기구별 상태 표시 (운영중/운휴/폐장)
- 최근 업데이트 시간 표시

## 🛠 기술 스택

- **Frontend**: Next.js, React
- **Styling**: CSS Modules
- **API**: Queue-times API
- **데이터**: JSON 기반 놀이공원 정보 관리

## 📱 반응형 디자인

- 데스크톱, 태블릿, 모바일 등 다양한 디바이스에서 최적화된 UI 제공
- 화면 크기에 따른 레이아웃 자동 조정

## 🌐 지원 국가

- 미국 (USA)
- 캐나다 (Canada)
- 중국 (China)
- 프랑스 (France)
- 벨기에 (Belgium)
- 네덜란드 (Netherlands)
- 독일 (Germany)
- 영국 (UK)
- 이탈리아 (Italy)
- 덴마크 (Denmark)
- 브라질 (Brazil)
- 폴란드 (Poland)
- 스웨덴 (Sweden)
- 스페인 (Spain)
- 대한민국 (South Korea)
- 멕시코 (Mexico)
- 홍콩 (Hong Kong)
- 일본 (Japan)

## 🔄 업데이트

실시간 대기시간 정보는 Queue-times API를 통해 제공되며, 각 놀이공원의 운영 시간에 맞춰 실시간으로 업데이트됩니다.
