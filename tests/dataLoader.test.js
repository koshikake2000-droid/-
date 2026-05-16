import { jest } from '@jest/globals';
import { loadSpots, getSpotsByCategory, getSpotsByRegion } from '../src/api/dataLoader.js';

global.fetch = jest.fn();

beforeEach(() => {
  fetch.mockClear();
});

const mockData = {
  week_label: "2026年5月11日（月）〜 5月17日（日）",
  published_at: "2026-05-08",
  regions: [
    {
      id: "kanto",
      name: "関東",
      spots: [
        {
          name: "浅草寺",
          category: "観光地・名所",
          location: "東京都台東区（浅草）",
          address: "東京都台東区浅草2丁目3-1",
          access: "東京メトロ浅草駅から徒歩5分",
          description: "東京最古の寺院。",
          reason: "5月は新緑が美しい。"
        },
        {
          name: "もんじゃストリート",
          category: "飲食店・カフェ",
          location: "東京都中央区（月島）",
          address: "東京都中央区月島1丁目",
          access: "東京メトロ月島駅から徒歩3分",
          description: "月島名物もんじゃ焼きの聖地。",
          reason: "下町グルメを堪能できる。"
        }
      ]
    },
    {
      id: "kansai",
      name: "関西",
      spots: [
        {
          name: "金閣寺",
          category: "観光地・名所",
          location: "京都府京都市（北区）",
          address: "京都府京都市北区金閣寺町1",
          access: "市バス金閣寺道バス停から徒歩2分",
          description: "金箔張りの舎利殿で知られる世界遺産。",
          reason: "新緑の季節が特に美しい。"
        }
      ]
    }
  ]
};

describe('loadSpots', () => {
  test('spotsデータを返す', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockData
    });
    const data = await loadSpots();
    expect(data.week_label).toBe(mockData.week_label);
    expect(data.regions).toHaveLength(2);
  });

  test('fetchが失敗したらエラーをスローする', async () => {
    fetch.mockResolvedValueOnce({ ok: false, status: 404 });
    await expect(loadSpots()).rejects.toThrow('404');
  });
});

describe('getSpotsByCategory', () => {
  test('全リージョンから該当カテゴリーのスポットを返す', () => {
    const results = getSpotsByCategory(mockData, "観光地・名所");
    expect(results).toHaveLength(2);
    expect(results.map((s) => s.name)).toEqual(["浅草寺", "金閣寺"]);
  });

  test('存在しないカテゴリーは空配列を返す', () => {
    const results = getSpotsByCategory(mockData, "存在しないカテゴリー");
    expect(results).toEqual([]);
  });
});

describe('getSpotsByRegion', () => {
  test('指定リージョンIDのスポット配列を返す', () => {
    const spots = getSpotsByRegion(mockData, "kanto");
    expect(spots).toHaveLength(2);
    expect(spots[0].name).toBe("浅草寺");
  });

  test('存在しないリージョンIDは空配列を返す', () => {
    const spots = getSpotsByRegion(mockData, "nonexistent");
    expect(spots).toEqual([]);
  });
});
