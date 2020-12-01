# Node.js와 TypeScript를 이용한 인증 서버 예제

## 특징
- Node.js 환경에서 타입스크립트와 의존성 주입 패턴을 사용하여, 통합 계정을 관리하는 예제 
- [routing-controllers](https://github.com/typestack/routing-controllers)와 [TypeDI](https://github.com/typestack/typedi) 라이브러리를 사용한 컨트롤러에 의존성 주입
- Account 정보를 ORM으로 처리, [TypeORM](https://github.com/typeorm/typeorm)와 Postgresql를 이용
- 구글/페이스북 엑세스 토큰을 검증하여 로그인 처리
- 게스트 로그인 가능
- JWT 발급 

## API
- /login
  - 구글/페이스북에서 받은 accessToken을 이용하여 로그인
  - 가입이 안된 계정은 자동 가입 후 로그인
  - 로그인에 성공하면 JWT 발급
- /signin
  - 게스트 계정으로 가입한 유저인 경우, 구글/페이스북으로 전환
- /docs
  - 스웨거를 이용한 API 문서

## 개발환경
- Node.js 14.15.1LTS
- TypeScript 4.1.2
- Postgresql

## 환경변수설정
- .env.example
  - .env로 이름변경 후 사용해야함
  - 서비스용 환경변수 파일 샘플
  - 구글 및 페이스북 OAuth 인증에 대한 앱 설정이 필요함
- .env.test.example
  - .env.test로 이름변경 후 사용해야함
  - 테스트용 환경변수 파일 샘플
  - 구글 및 페이스북 OAuth 인증에 대한 앱 설정이 필요함
  - 테스트 전용 DB 설정 가능
  - 테스트용 엑세스 토큰을 이용하여 OAuth 인증 로직 테스트 가능

