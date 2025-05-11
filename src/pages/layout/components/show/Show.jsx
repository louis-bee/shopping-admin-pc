import { Card } from "antd";
import './Show.scss'
import MonthLogin from "./components/MonthLogin";
import HotGoods from "./components/HotGoods";

const Show = () => {
  return (
    <div>
      <Card title='数据中心' >
        <div className="box">
          <MonthLogin />
          <HotGoods />
        </div>
      </Card>  
    </div>
  )
}
export default Show