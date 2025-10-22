import { useState, useEffect, useRef } from "react";
import { VictoryBar, VictoryChart, VictoryTheme, VictoryAxis } from "victory";
import api from "../../api/axiosInstance";
import { usePesertaStore } from "../../store/usePesertaStore";

interface DataPoint {
  x: string;
  y: number;
}

interface Peserta {
  id: string;
  fullName: string;
  tglLahir: string;
  bulan: string;
  tanggal: string;
  asalSekolah: string;
  usia: number;
}

const Chart: React.FC = () => {
  const { setPesertaList } = usePesertaStore();
  const [chartData, setChartData] = useState<DataPoint[]>([]);
  const hasFetched = useRef(false);

  const namaBulan = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const fetchData = async () => {
    try {
      const response = await api.get("/peserta");
      const data: Peserta[] = response.data.data;

      setPesertaList(data);

      // Menghitung jumlah peserta per bulan berdasarkan tglLahir
      const bulanCount: { [key: string]: number } = {};

      data.forEach((peserta) => {
        // Ekstrak bulan dari tglLahir (format: "1999-11-26T00:00:00.000Z")
        const date = new Date(peserta.tglLahir);
        const bulanIndex = date.getMonth(); // 0-11
        const bulanNama = namaBulan[bulanIndex];

        // Hitung jumlah per bulan
        bulanCount[bulanNama] = (bulanCount[bulanNama] || 0) + 1;
      });

      // Konversi ke format untuk chart
      const formattedData: DataPoint[] = namaBulan.map((bulan) => ({
        x: bulan,
        y: bulanCount[bulan] || 0,
      }));

      setChartData(formattedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const colors: string[] = [
    "#6366F1",
    "#22C55E",
    "#F59E0B",
    "#EC4899",
    "#3B82F6",
    "#10B981",
    "#F97316",
    "#8B5CF6",
    "#14B8A6",
    "#EAB308",
    "#EF4444",
    "#0EA5E9",
  ];

  useEffect(() => {
    if (!hasFetched.current) {
      fetchData();
      hasFetched.current = true;
    }
  }, []);

  return (
    <div className="w-full h-full">
      <svg viewBox="0 0 800 400" width="100%" height="100%">
        <VictoryChart
          standalone={false}
          width={800}
          height={400}
          domainPadding={{ x: 30 }}
          theme={VictoryTheme.material}
        >
          <VictoryAxis
            style={{
              tickLabels: { fontSize: 12, padding: 5 },
            }}
          />
          <VictoryAxis
            dependentAxis
            style={{
              tickLabels: { fontSize: 12, padding: 5 },
            }}
          />
          <VictoryBar
            data={chartData}
            style={{
              data: {
                fill: ({ index }: any) => colors[index % colors.length],
                width: 40,
              },
            }}
            animate={{
              duration: 500,
              onLoad: { duration: 500 },
            }}
          />
        </VictoryChart>
      </svg>
    </div>
  );
};

export default Chart;
