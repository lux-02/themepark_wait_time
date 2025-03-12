export default async function handler(req, res) {
  const { id } = req.query;

  try {
    const response = await fetch(
      `https://queue-times.com/parks/${id}/queue_times.json`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch park data");
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res
      .status(500)
      .json({ error: "놀이공원 데이터를 가져오는데 실패했습니다." });
  }
}
