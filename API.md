# Phim API Documentation

## Nguồn API

Dự án sử dụng 2 nguồn API chính:

### 1. KKPhim (phimapi.com)
- **Base URL**: `https://phimapi.com`
- **API Docs**: https://kkphim.com/tai-lieu-api

### 2. NguonC (phim.nguonc.com)
- **Base URL**: `https://phim.nguonc.com/api`
- **API Docs**: https://phim.nguonc.com/api-document

---

## KKPhim API Endpoints

### Danh sách phim

```
GET https://phimapi.com/danh-sach/phim-moi-cap-nhat?page={page}
GET https://phimapi.com/v1/api/danh-sach/{type_list}?page={page}&limit={limit}&sort_field=modified.time&sort_type=desc&sort_lang=vietsub
```

**Parameters:**
- `page` - Số trang (default: 1)
- `limit` - Số phim mỗi trang (default: 12)
- `type_list` - Loại danh sách:
  - `phim-vietsub` - Phim vietsub
  - `phim-thuyet-minh` - Phim thuyết minh
  - `phim-long-tieng` - Phim lồng tiếng
  - `hoat-hinh` - Anime/Hoạt hình
  - `phim-bo` - Phim bộ
  - `phim-le` - Phim lẻ
  - `phim-chieu-rap` - Phim chiếu rạp

**Ví dụ:**
```
GET https://phimapi.com/v1/api/danh-sach/hoat-hinh?page=1&limit=15&sort_field=modified.time&sort_type=desc&sort_lang=vietsub&limit=15
```

### Thể loại phim

```
GET https://phimapi.com/the-loai
```

**Response:**
```json
[
  { "_id": "9822be111d2ccc29c7172c78b8af8ff5", "name": "Hành Động", "slug": "hanh-dong" },
  { "_id": "d111447ee87ec1a46a31182ce4623662", "name": "Miền Tây", "slug": "mien-tay" },
  ...
]
```

### Phim theo thể loại

```
GET https://phimapi.com/v1/api/the-loai/{slug}?page={page}&sort_field=modified.time&sort_type=desc&sort_lang={lang}&limit={limit}
```

**Ví dụ:**
```
GET https://phimapi.com/v1/api/the-loai/hanh-dong?page=1&sort_field=modified.time&sort_type=desc&sort_lang=vietsub&limit=24
```

### Quốc gia

```
GET https://phimapi.com/quoc-gia
```

### Phim theo quốc gia

```
GET https://phimapi.com/v1/api/quoc-gia/{slug}?page={page}&sort_field=_id&sort_type=asc&sort_lang={lang}&limit={limit}
```

### Tìm kiếm phim

```
GET https://phimapi.com/v1/api/tim-kiem?keyword={keyword}&page={page}&sort_field=_id&sort_type=asc&sort_lang={lang}&limit={limit}
```

### Chi tiết phim

```
GET https://phimapi.com/phim/{slug}
```

**Response:**
```json
{
  "movie": {
    "name": "Tên phim",
    "origin_name": "Original Name",
    "poster_url": "upload/vod/...",
    "thumb_url": "upload/vod/...",
    "quality": "FHD",
    "lang": "Vietsub",
    "episode_current": "Tập 1",
    "content": "Mô tả phim",
    "category": [{ "name": "Hành Động", "slug": "hanh-dong" }],
    "country": [{ "name": "Nhật Bản", "slug": "nhat-ban" }]
  },
  "episodes": [
    {
      "server_name": "VN",
      "server_data": [
        { "name": "Tập 1", "slug": "tap-1", "link_m3u8": "..." }
      ]
    }
  ]
}
```

---

## NguonC API Endpoints

### Phim mới cập nhật

```
GET https://phim.nguonc.com/api/films/phim-moi-cap-nhat?page={page}
```

### Phim theo danh mục

```
GET https://phim.nguonc.com/api/films/danh-sach/{slug}?page={page}
```

**slug options:**
- `phim-dang-chieu` - Phim đang chiếu
- `phim-bo` - Phim bộ
- `phim-le` - Phim lẻ
- `tv-shows` - TV Shows

### Phim theo thể loại

```
GET https://phim.nguonc.com/api/films/the-loai/{slug}?page={page}
```

**slug options:**
- `hanh-dong` - Hành Động
- `phieu-luu` - Phiêu Lưu
- `hoat-hinh` - Hoạt Hình
- `hai-huoc` - Hài
- `hinh-su` - Hình Sự
- `tai-lieu` - Tài Liệu
- `chinh-kich` - Chính Kịch
- `gia-dinh` - Gia Đình
- `gia-tuong` - Giả Tưởng
- `lich-su` - Lịch Sử
- `kinh-di` - Kinh Dị
- `am-nhac` - Nhạc
- `bi-an` - Bí Ẩn
- `lang-man` - Lãng Mạn
- `khoa-hoc-vien-tuong` - Khoa Học Viễn Tưởng
- `gay-can` - Gây Cấn
- `chien-tranh` - Chiến Tranh
- `tam-ly` - Tâm Lý
- `tinh-cam` - Tình Cảm
- `co-trang` - Cổ Trang
- `mien-tay` - Miền Tây
- `phim-18` - Phim 18+

### Phim theo quốc gia

```
GET https://phim.nguonc.com/api/films/quoc-gia/{slug}?page={page}
```

**slug options:**
- `au-my` - Âu Mỹ
- `anh` - Anh
- `trung-quoc` - Trung Quốc
- `indonesia` - Indonesia
- `viet-nam` - Việt Nam
- `phap` - Pháp
- `hong-kong` - Hồng Kông
- `han-quoc` - Hàn Quốc
- `nhat-ban` - Nhật Bản
- `thai-lan` - Thái Lan
- `dai-loan` - Đài Loan
- `nga` - Nga
- `ha-lan` - Hà Lan
- `philippines` - Philippines
- `an-do` - Ấn Độ
- `quoc-gia-khac` - Quốc gia khác

### Phim theo năm

```
GET https://phim.nguonc.com/api/films/nam-phat-hanh/{year}?page={page}
```

### Tìm kiếm phim

```
GET https://phim.nguonc.com/api/films/search?keyword={keyword}&page={page}
```

### Chi tiết phim

```
GET https://phim.nguonc.com/api/film/{slug}
```

---

## Image URL

```
Base: https://phimimg.com
Path: /upload/vod/...
Full URL: https://phimimg.com/upload/vod/...
```

**Hàm resolveImageUrl:**
```typescript
function resolveImageUrl(path: string): string {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `https://phimimg.com${path}`;
}
```

---

## Website Routes

| Route | Mô tả |
|-------|-------|
| `/` | Trang chủ |
| `/phim` | Tất cả phim |
| `/phim-moi` | Phim mới |
| `/phim-bo` | Phim bộ |
| `/phim-le` | Phim lẻ |
| `/phim-vietsub` | Phim vietsub |
| `/phim-thuyet-minh` | Phim thuyết minh |
| `/phim-long-tieng` | Phim lồng tiếng |
| `/phim-chieu-rap` | Phim chiếu rạp |
| `/hoat-hinh` | Anime |
| `/tv-shows` | TV Shows |
| `/sap-chieu` | Phim sắp chiếu |
| `/the-loai/{slug}` | Phim theo thể loại |
| `/quoc-gia/{slug}` | Phim theo quốc gia |
| `/phim/{slug}` | Chi tiết phim |
| `/search` | Tìm kiếm |
| `/favourite` | Yêu thích |
| `/profile` | Hồ sơ |
| `/auth` | Đăng nhập/Đăng ký |
