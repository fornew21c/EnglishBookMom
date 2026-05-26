// Master book list - shown on home page in this order.
//
// Verification levels:
//   'verified' (or omitted)  — chapter structure and vocabulary cross-checked
//                              against the actual book or a primary source.
//   'draft'                  — chapter structure is plausible but vocabulary
//                              has NOT been verified against the book text.
//                              Shown on the home page with a "검수 중" badge.
//   'unverified'             — not shown on the home page (kept here only as
//                              a manual override for hiding entries).
//
// For 'draft' entries, include `sourcesKo` listing what was used so reviewers
// know what still needs cross-checking against the actual book.
window.BOOKS = [
  {
    slug: 'mth-1',
    title: 'Dinosaurs Before Dark',
    titleKo: '공룡들의 골짜기',
    series: 'Magic Tree House #1',
    seriesKo: '매직 트리 하우스 1권',
    ar: '2.6',
    descKo: '잭과 애니가 마법의 나무집을 발견하고 공룡 시대로 떠나는 시리즈의 첫 이야기.',
    aboutKo: '평범한 남매 잭과 애니가 숲속에서 마법의 나무집을 발견하고, 책 속 그림을 가리키며 “나도 가 보고 싶다”고 말하자 진짜로 공룡 시대로 날아갑니다. 시리즈의 첫 권답게 챕터가 짧고 문장이 단순해 입문용으로 가장 사랑받는 책이에요.',
    emoji: '🦕',
    color: 'color-2',
    coverUrl: 'https://covers.openlibrary.org/b/isbn/9780679824114-L.jpg?default=false',
    verification: 'verified'
  },
  {
    slug: 'mth-2',
    title: 'The Knight at Dawn',
    titleKo: '성안의 검은 기사',
    series: 'Magic Tree House #2',
    seriesKo: '매직 트리 하우스 2권',
    ar: '2.9',
    descKo: '잭과 애니가 중세 시대로 가서 성과 기사, 비밀 통로를 모험하는 이야기.',
    aboutKo: '이번엔 중세 성으로 떠난 잭과 애니. 화려한 연회장에 몰래 들어갔다가 검은 기사에게 들켜 비밀 통로로 도망치게 되는데… 성과 기사라는 환상적인 배경 덕분에 아이들이 가장 좋아하는 권 중 하나예요.',
    emoji: '🏰',
    color: 'color-4',
    coverUrl: 'https://covers.openlibrary.org/b/isbn/9780679824121-L.jpg?default=false',
    verification: 'verified'
  },
  {
    slug: 'mth-3',
    title: 'Mummies in the Morning',
    titleKo: '미라의 비밀',
    series: 'Magic Tree House #3',
    seriesKo: '매직 트리 하우스 3권',
    ar: '2.8',
    descKo: '잭과 애니가 고대 이집트의 피라미드 안에서 미라 여왕을 만나는 이야기.',
    aboutKo: '고대 이집트의 피라미드 속으로 들어간 잭과 애니. 어둠 속에서 헤매다가 죽음의 나라로 가지 못한 여왕 미라를 만나게 됩니다. 이집트 문명에 대한 흥미를 자연스럽게 키워주는 권이에요.',
    emoji: '🏺',
    color: 'color-3',
    coverUrl: 'https://covers.openlibrary.org/b/isbn/9780679824244-L.jpg?default=false',
    verification: 'verified'
  },
  {
    slug: 'dragon-1',
    title: 'Rise of the Earth Dragon',
    titleKo: '땅의 용을 깨우다',
    series: 'Dragon Masters #1',
    seriesKo: '드래곤 마스터즈 1권',
    ar: '3.1',
    descKo: '평범한 농부 소년 드레이크가 드래곤 마스터로 뽑혀 자신의 용을 만나는 이야기.',
    aboutKo: '평범한 양파 농장 소년이던 드레이크는 어느 날 왕의 신하에게 끌려가 “드래곤 마스터”가 됩니다. 자기만의 용을 찾고 친구가 되는 첫 모험. 짧은 챕터(15개)와 큰 글씨, 컬러 일러스트가 많아 챕터북 입문에 좋아요.',
    emoji: '🐉',
    color: 'color-1',
    coverUrl: 'https://covers.openlibrary.org/b/isbn/9780545646239-L.jpg?default=false',
    verification: 'verified'
  },
  {
    slug: 'dragon-2',
    title: 'Saving the Sun Dragon',
    titleKo: '태양의 용을 구하라',
    series: 'Dragon Masters #2',
    seriesKo: '드래곤 마스터즈 2권',
    ar: '3.1',
    descKo: '아나의 태양 드래곤 케프리가 시름시름 앓자, 드래곤 마스터들이 비밀을 찾아 먼 나라로 떠나는 이야기.',
    aboutKo: '드래곤 마스터들이 함께 훈련하던 중, 아나의 태양 드래곤 케프리가 점점 빛을 잃고 약해집니다. 드레이크와 친구들은 웜의 순간이동 마법으로 머나먼 사막 나라로 가서 옛 드래곤 마스터를 만나고, 케프리의 비밀을 알아냅니다. 우정과 협력의 이야기.',
    emoji: '☀️',
    color: 'color-3',
    coverUrl: 'https://covers.openlibrary.org/b/isbn/9780545646260-L.jpg?default=false',
    verification: 'verified'
  },
  {
    slug: 'dragon-3',
    title: 'Secret of the Water Dragon',
    titleKo: '물의 용의 비밀',
    series: 'Dragon Masters #3',
    seriesKo: '드래곤 마스터즈 3권',
    ar: '3.1',
    descKo: '물의 용 슈와 마스터 보가 도착하면서, 누군가 드래곤들을 위협하려 한다는 사실이 드러나는 이야기.',
    aboutKo: '왕의 성에 새로운 드래곤 마스터 보(Bo)와 물의 용 슈(Shu)가 도착합니다. 평소 조용한 보는 마음이 깊고, 슈는 신비한 환영(vision)을 보여 줘요. 누군가 드래곤들을 노린다는 경고가 떠오르고, 그리피스와 마스터들은 함께 위험에 맞서야 합니다.',
    emoji: '💧',
    color: 'color-2',
    coverUrl: 'https://covers.openlibrary.org/b/isbn/9780545646284-L.jpg?default=false',
    verification: 'draft',
    sourcesKo: ['Scholastic Branches 시리즈 소개', 'Dragon Masters Wiki 줄거리', '※ 실제 책 본문 미검증']
  },
  {
    slug: 'mercy-1',
    title: 'Mercy Watson to the Rescue',
    titleKo: '구하러 가는 머시 왓슨',
    series: 'Mercy Watson #1',
    seriesKo: '머시 왓슨 1권',
    ar: '2.7',
    descKo: '왓슨 부부가 키우는 돼지 머시가 한밤중에 침대를 흔들면서 벌어지는 코믹 소동극.',
    aboutKo: '왓슨 부부는 돼지 머시를 자식처럼 사랑해서 침대에서 함께 잡니다. 어느 밤, 무거운 머시가 침대를 흔들어 바닥에 구멍이 나기 시작하는데… 큼지막한 그림과 짧은 챕터로 그림책에서 챕터북으로 넘어가는 다리 역할을 해요.',
    emoji: '🐷',
    color: 'color-6',
    coverUrl: 'https://covers.openlibrary.org/b/isbn/9780763622701-L.jpg?default=false',
    verification: 'verified'
  },
  {
    slug: 'mercy-2',
    title: 'Mercy Watson Goes for a Ride',
    titleKo: '드라이브하러 가는 머시 왓슨',
    series: 'Mercy Watson #2',
    seriesKo: '머시 왓슨 2권',
    ar: '2.8',
    descKo: '머시가 왓슨 부부와 토요일 드라이브를 나섰다가, 핸들을 잡는 대소동이 벌어지는 이야기.',
    aboutKo: '머시는 토요일마다 왓슨 부부와 분홍색 컨버터블을 타고 드라이브하는 걸 좋아해요. 그런데 이번엔 옆집 베이비가 몰래 뒷자리에 숨어 있고, 흥분한 머시가 결국 운전대까지 잡아 버립니다. 토밀렐로 경관이 등장하는 코믹 추격전이 펼쳐져요.',
    emoji: '🚗',
    color: 'color-4',
    coverUrl: 'https://covers.openlibrary.org/b/isbn/9780763623326-L.jpg?default=false',
    verification: 'draft',
    sourcesKo: ['Candlewick Common Core Teachers’ Guide', 'Mercy Watson Wiki 줄거리', '※ 실제 책 본문 미검증']
  },
  {
    slug: 'mercy-3',
    title: 'Mercy Watson Fights Crime',
    titleKo: '도둑을 잡는 머시 왓슨',
    series: 'Mercy Watson #3',
    seriesKo: '머시 왓슨 3권',
    ar: '3.2',
    descKo: '카우보이 차림의 작은 도둑이 한밤중 왓슨네 집에 들어왔다가, 머시 때문에 일이 꼬이는 이야기.',
    aboutKo: '한밤중, 작은 카우보이 같은 도둑 르로이 닌커(Leroy Ninker)가 토스터를 훔치러 왓슨네 부엌에 들어옵니다. 그런데 마침 토스트 냄새에 깨어난 머시 때문에 일이 엉뚱하게 흘러가게 되는데… 시리즈 중 가장 인기 있는 권으로, 영웅이 된 머시를 다시 볼 수 있어요.',
    emoji: '🦹',
    color: 'color-5',
    coverUrl: 'https://covers.openlibrary.org/b/isbn/9780763625900-L.jpg?default=false',
    verification: 'draft',
    sourcesKo: ['Candlewick 시리즈 소개', 'Mercy Watson Wiki 줄거리', '※ 실제 책 본문 미검증']
  },
  {
    slug: 'dragon-trainer-1',
    title: 'How to Train Your Dragon',
    titleKo: '드래곤 길들이기',
    series: 'How to Train Your Dragon #1',
    seriesKo: '드래곤 길들이기 시리즈 1권',
    ar: '6.6',
    descKo: '바이킹 소년 히컵이 작고 이빨도 없는 못난 드래곤 투슬리스와 친구가 되어 마을을 구하는 이야기.',
    aboutKo: '바이킹 부족장의 아들 히컵은 작고 약하지만 누구보다 똑똑한 소년. 모든 바이킹 소년이 거쳐야 할 \'드래곤 길들이기 시험\'에서 가장 작고 이빨 없는 드래곤 투슬리스를 잡습니다. 힘 대신 머리와 우정으로 어려움을 헤쳐 가는 명작. 글이 많고 단어 수준은 높지만 아이와 엄마가 함께 천천히 읽기 좋은 책이에요.',
    emoji: '🐲',
    color: 'color-5',
    coverUrl: 'https://covers.openlibrary.org/b/isbn/9780316085274-L.jpg?default=false',
    verification: 'verified'
  },
  {
    slug: 'atoz-1',
    title: 'The Absent Author',
    titleKo: '사라진 작가',
    series: 'A to Z Mysteries #1',
    seriesKo: 'A to Z 미스터리 1권',
    ar: '3.2',
    descKo: '딩크, 조시, 루스 로즈가 사라진 추리소설 작가의 행방을 쫓는 미스터리.',
    aboutKo: '딩크가 가장 좋아하는 추리소설 작가가 책 사인회에 나타나지 않습니다. 친구들과 함께 호텔 방을 살펴보다 이상한 단서를 발견하게 되는데… A부터 Z까지 알파벳 순서로 26권이 이어지는 미스터리 시리즈의 시작이에요.',
    emoji: '🔍',
    color: 'color-5',
    coverUrl: 'https://covers.openlibrary.org/b/isbn/9780679881681-L.jpg?default=false',
    verification: 'verified'
  },
  {
    slug: 'atoz-2',
    title: 'The Bald Bandit',
    titleKo: '대머리 강도',
    series: 'A to Z Mysteries #2',
    seriesKo: 'A to Z 미스터리 2권',
    ar: '3.2',
    descKo: '비디오에 찍힌 대머리 은행 강도를 딩크와 친구들이 추적하는 미스터리.',
    aboutKo: '딩크와 친구들은 우연히 은행 강도가 찍힌 비디오테이프를 보게 됩니다. 강도는 대머리(bald)였어요. 친구들은 단서를 따라 도시 곳곳을 누비며 진짜 범인을 찾아 나섭니다. 추리·관찰력을 자연스럽게 익힐 수 있는 권.',
    emoji: '📼',
    color: 'color-1',
    coverUrl: 'https://covers.openlibrary.org/b/isbn/9780679884491-L.jpg?default=false',
    verification: 'draft',
    sourcesKo: ['PRH A to Z Mysteries Educator Guide', 'A to Z Mysteries Wiki 줄거리', '※ 실제 책 본문 미검증']
  },
  {
    slug: 'atoz-3',
    title: 'The Canary Caper',
    titleKo: '사라진 카나리아',
    series: 'A to Z Mysteries #3',
    seriesKo: 'A to Z 미스터리 3권',
    ar: '3.0',
    descKo: '동네 반려동물들이 차례로 사라지자, 딩크와 친구들이 단서를 따라가는 미스터리.',
    aboutKo: '루스 로즈의 카나리아 트위티가 사라집니다. 다른 집 강아지, 고양이까지 차례로 없어지자, 친구들은 단서(clue)를 모아 누가 동물들을 데려갔는지 추리해요. 미스터리 단어(case, clue, suspect 등)와 친해지기 좋은 권.',
    emoji: '🐦',
    color: 'color-3',
    coverUrl: 'https://covers.openlibrary.org/b/isbn/9780679885931-L.jpg?default=false',
    verification: 'draft',
    sourcesKo: ['PRH A to Z Mysteries Educator Guide', 'A to Z Mysteries Wiki 줄거리', '※ 실제 책 본문 미검증']
  },
  {
    slug: 'atoz-4',
    title: 'The Deadly Dungeon',
    titleKo: '위험한 지하 감옥',
    series: 'A to Z Mysteries #4',
    seriesKo: 'A to Z 미스터리 4권',
    ar: '3.2',
    descKo: '친구의 큰아버지가 사는 진짜 성에 놀러 갔다가, 사라진 보물과 지하 감옥의 비밀을 푸는 미스터리.',
    aboutKo: '딩크, 조시, 루스 로즈는 조시의 큰아버지가 사는 진짜 성(Moose Manor)에 초대받아 갑니다. 그런데 밤마다 이상한 소리가 들리고, 옛 보물이 사라졌다는 소문까지 떠돌아요. 친구들은 지하 감옥(dungeon)까지 내려가 진실을 찾아냅니다.',
    emoji: '🏰',
    color: 'color-2',
    coverUrl: 'https://covers.openlibrary.org/b/isbn/9780679887553-L.jpg?default=false',
    verification: 'draft',
    sourcesKo: ['PRH A to Z Mysteries Educator Guide', 'A to Z Mysteries Wiki 줄거리', '※ 실제 책 본문 미검증']
  }
];
