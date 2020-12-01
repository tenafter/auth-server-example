export interface IJwtPayload {
    sub: string; // 유저 아이디
    exp: number; // 유효시간
    iat: number; // 발급시간
}
