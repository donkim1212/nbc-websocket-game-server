# Node.js 게임서버 심화 주차 개인 과제

## 패킷 구조 설계

- 공통 패킷 구조

<table>
<tr>
<td>필드 명</td>
<td>타입</td>
<td>설명</td>
</tr>

<tr>
<td>handlerId</td>
<td>int</td>
<td>요청을 처리할 서버 핸들러의 ID</td>
</tr>

<tr>
<td>userId</td>
<td>int</td>
<td>요청을 보내는 유저의 ID</td>
</tr>

<tr>
<td>clientVersion</td>
<td>string</td>
<td>현재 클라이언트 버전 ("1.0.0") (고정)</td>
</tr>

<tr>
<td>payload</td>
<td>JSON</td>
<td>요청 내용</td>
</tr>
</table>

<br>
<br>

- 스테이지 이동

<table>
<tr>
<td>필드 명</td>
<td>타입</td>
<td>설명</td>
</tr>

<tr>
<td>currentStage</td>
<td>int</td>
<td>현재 스테이지</td>
</tr>

<tr>
<td>targetStage</td>
<td>int</td>
<td>이동하는 스테이지</td>
</tr>
</table>

<br>
<br>

- 아이템 획득

<table>
<tr>
<td>필드 명</td>
<td>타입</td>
<td>설명</td>
</tr>

<tr>
<td>itemId</td>
<td>int</td>
<td>획득하는 아이템 ID</td>
</tr>
</table>
