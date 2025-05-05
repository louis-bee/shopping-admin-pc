import { getMonthLoginByAdminAPI } from "@/apis/data"
import { message } from "antd";
import { useEffect, useRef, useState } from "react"
import { useSelector } from "react-redux"
import * as echarts from 'echarts';

const MonthLogin = () => {

  const userId =  useSelector(state => state.user.userInfo.id)

  const chartRef = useRef(null)

  const [ monthLogin, setMonthLogin ] = useState({dates: [], counts: []})

  useEffect(() => {
    async function getData() {
      const params = {
        adminId: userId
      };
      const res = await getMonthLoginByAdminAPI(params);
      if (res.status === 200) {
        // 假设后端返回的数据格式是 { monthTotal: { dates: [], counts: [] } }
        setMonthLogin(res.data.monthLogin);
      } else {
        message.error(res.desc)
      }
    }

    getData();
  }, [userId]);

  useEffect(() => {
    if (chartRef.current && monthLogin.dates.length > 0) {
      const chartDom = chartRef.current;
      const myChart = echarts.init(chartDom);
      const option = {
        title: {
          text:'近15天用户量',
        },
        xAxis: {
          type: 'category',
          data: monthLogin.dates
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            data: monthLogin.counts,
            type: 'line'
          }
        ]
      };

      myChart.setOption(option);
    }
  }, [monthLogin]);

  const style = {
    width: 600,
    height: 400,
    padding: 20,
  }

  return (
    <div ref={chartRef} style={style}></div>
  )
}
export default MonthLogin