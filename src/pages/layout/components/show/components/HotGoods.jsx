import { getTopSellerAPI } from "@/apis/data"
import { useEffect, useRef, useState } from "react"
import { useSelector } from "react-redux"
import * as echarts from 'echarts';
import { message } from "antd";

const HotGoods = () => {

  const userId =  useSelector(state => state.user.userInfo.id)

  const chartRef = useRef(null)

  const [ hotGoods, setHotGoods ] = useState({sellers: [], counts: []})

  useEffect(() => {
    async function getData() {
      const params = {
        adminId: userId
      };
      const res = await getTopSellerAPI(params);
      if (res.status === 200) {
        setHotGoods(res.data.topSeller)
      } else {
        message.error(res.desc)
      }
    }

    getData();
  }, [userId]);

  useEffect(() => {
    if (chartRef.current && hotGoods.sellers.length > 0) {
      const chartDom = chartRef.current;
      const myChart = echarts.init(chartDom);
      const option = {
        title: {
          text: '最佳销售人员排行榜',
        },
        xAxis: {
          type: 'category',
          data: hotGoods.sellers
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            data: hotGoods.counts,
            type: 'bar',
          }
        ]
      };

      myChart.setOption(option);
    }
  }, [hotGoods]);

  const style = {
    width: 600,
    height: 400,
    padding: 20,
  }

  return (
    <div ref={chartRef} style={style}></div>
  )
}
export default HotGoods