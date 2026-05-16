export async function loadSpots() {
  const url = new URL('./spots.json', import.meta.url);
  let response;
  try {
    response = await fetch(url);
  } catch (networkError) {
    throw new Error(`ネットワークエラー: スポットデータに接続できませんでした。(${networkError.message})`);
  }
  if (!response.ok) {
    throw new Error(
      `スポットデータの取得に失敗しました (HTTP ${response.status} ${response.statusText}) — URL: ${url}`
    );
  }
  let data;
  try {
    data = await response.json();
  } catch (parseError) {
    throw new Error(`スポットデータのJSON解析に失敗しました: ${parseError.message}`);
  }
  return data;
}

export function getSpotsByCategory(data, category) {
  return data.regions.flatMap((region) =>
    region.spots.filter((spot) => spot.category === category)
  );
}

export function getSpotsByRegion(data, regionId) {
  const region = data.regions.find((r) => r.id === regionId);
  return region ? region.spots : [];
}
