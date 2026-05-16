import { createSpotCard } from '../src/components/SpotCard.js';

const sampleSpot = {
  name: "小樽運河",
  category: "観光地・名所",
  location: "北海道小樽市",
  description: "明治・大正時代の石造倉庫が立ち並ぶ歴史的な運河。",
  reason: "5月は桜と運河の組み合わせが美しい。"
};

const sampleSpotFull = {
  name: "小樽運河",
  category: "観光地・名所",
  location: "北海道小樽市（小樽駅周辺）",
  address: "北海道小樽市港町1丁目",
  access: "JR小樽駅から徒歩10分",
  description: "明治・大正時代の石造倉庫が立ち並ぶ歴史的な運河。",
  reason: "5月は桜と運河の組み合わせが美しい。"
};

describe('createSpotCard', () => {
  test('article要素を返す', () => {
    const card = createSpotCard(sampleSpot);
    expect(card.tagName).toBe('ARTICLE');
    expect(card.className).toBe('spot-card');
  });

  test('スポット名が表示される', () => {
    const card = createSpotCard(sampleSpot);
    expect(card.querySelector('.spot-name').textContent).toBe('小樽運河');
  });

  test('カテゴリーバッジに正しいクラスが付く', () => {
    const card = createSpotCard(sampleSpot);
    const badge = card.querySelector('.category-badge');
    expect(badge.classList.contains('cat-tourist')).toBe(true);
    expect(badge.textContent).toBe('観光地・名所');
  });

  test('未知のカテゴリーはcat-touristにフォールバックする', () => {
    const card = createSpotCard({ ...sampleSpot, category: "その他" });
    expect(card.querySelector('.category-badge').classList.contains('cat-tourist')).toBe(true);
  });

  test('場所・説明・ポイントが表示される', () => {
    const card = createSpotCard(sampleSpot);
    expect(card.querySelector('.spot-location').textContent).toBe('北海道小樽市');
    expect(card.querySelector('.spot-description').textContent).toBe(sampleSpot.description);
    expect(card.querySelector('.spot-reason').textContent).toBe(sampleSpot.reason);
  });

  describe('address フィールド', () => {
    test('addressがある場合、.spot-address要素が表示される', () => {
      const card = createSpotCard(sampleSpotFull);
      const el = card.querySelector('.spot-address');
      expect(el).not.toBeNull();
      expect(el.textContent).toBe('北海道小樽市港町1丁目');
    });

    test('addressがない場合、.spot-address要素は存在しない（後方互換性）', () => {
      const card = createSpotCard(sampleSpot);
      expect(card.querySelector('.spot-address')).toBeNull();
    });
  });

  describe('access フィールド', () => {
    test('accessがある場合、.spot-access要素が表示される', () => {
      const card = createSpotCard(sampleSpotFull);
      const el = card.querySelector('.spot-access');
      expect(el).not.toBeNull();
      expect(el.textContent).toBe('JR小樽駅から徒歩10分');
    });

    test('accessがない場合、.spot-access要素は存在しない（後方互換性）', () => {
      const card = createSpotCard(sampleSpot);
      expect(card.querySelector('.spot-access')).toBeNull();
    });
  });
});
