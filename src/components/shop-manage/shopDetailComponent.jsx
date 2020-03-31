import React from 'react';
import styles from './shopDetailComponent.less';
import { ProgressBar, } from '../common/new-component/NewComponent';
import { Row, Col, Button, Modal, Radio, } from 'antd';
import { Map, Marker, } from 'react-bmap';
function ShopDetailComponent({
  detailLoading,
  shopDetailMess,
  shopItemDetailShow,
  showEditShop,
  closeDialog,
}) {
  const supFacStrArr =
    shopDetailMess.suppFac &&
    shopDetailMess.suppFac.split(',').map(item => {
      if (item == 1) {
        return '无线';
      }
      if (item == 2) {
        return '停车劵';
      }
      if (item == 3) {
        return '休息区';
      }
      if (item == 4) {
        return '寄存区';
      }
    });
  const shopStatus = function(e) {
    if (e == 1) {
      return <span>营业中</span>;
    }
    if (e == 2) {
      return <span>歇业中</span>;
    }
    if (e == 9) {
      return <span>停业整顿</span>;
    }
  };

  return (
    <Modal
      footer={null}
      onCancel={closeDialog}
      title="店铺详情"
      visible={shopItemDetailShow}
      width="800px"
    >
      <div className={styles.shopDetailContainer}>
        {detailLoading ? (
          <div className={styles.shopDetail}>
            <Row justify="space-between"
              type="flex"
            >
              {/* <Col span={4}>
                <Button>返回</Button>
              </Col> */}
              <Col span={4}>
                <Button onClick={showEditShop.bind(this, 2)}
                  type="primary"
                >
                  编辑
                </Button>
              </Col>
            </Row>
            <div className={styles.detailItem}>
              <Row justify="space-between"
                type="flex"
              >
                <Col span={4}>
                  <div className={styles.detailItemTitle}>名称</div>
                </Col>
                <Col span={4}>
                  <div className={styles.detailItemTitle}>所在城市</div>
                </Col>
                <Col span={4}>
                  <div className={styles.detailItemTitle}>门店状态</div>
                </Col>
                <Col span={4}>
                  <div className={styles.detailItemTitle}>门店商品</div>
                </Col>
              </Row>
              <Row justify="space-between"
                type="flex"
              >
                <Col span={4}>{shopDetailMess.name}</Col>
                <Col span={4}>{shopDetailMess.city}</Col>
                <Col span={4}>{shopStatus(shopDetailMess.status)}</Col>
                <Col span={4}>{shopDetailMess.goodsCount}</Col>
              </Row>
            </div>
            <div className={styles.detailItem}>
              <Row justify="left"
                type="flex"
              >
                <Col span={12}>
                  <div className={styles.detailItemTitle}>创建时间:</div>
                  {shopDetailMess.createTime}
                </Col>
                <Col span={12}>
                  <div className={styles.detailItemTitle}>营业时间:</div>
                  {shopDetailMess.bussTime}
                </Col>
              </Row>
              <Row justify="left"
                type="flex"
              >
                <Col span={12}>
                  <div className={styles.detailItemTitle}>地址:</div>
                  {shopDetailMess.address}
                </Col>
                <Col span={12}>
                  <div className={styles.detailItemTitle}>商家电话:</div>
                  {shopDetailMess.tel}
                </Col>
              </Row>
              <Row justify="left"
                   type="flex"
              >
                <Col span={12}>
                  <div className={styles.detailItemTitle}>辐射范围(米):</div>
                  {shopDetailMess.radiationRange}
                </Col>
                <Col span={12}>
                  <div className={styles.detailItemTitle}>经纬度:</div>
                  {parseFloat(Number(shopDetailMess.lon).toFixed(2))},{Number(shopDetailMess.lat).toFixed(2)}
                </Col>
              </Row>
              <Row justify="left"
                   type="flex"
              >
                <Col span={12}>
                  <div className={styles.detailItemTitle}>门店模式:</div>
                  {
                    shopDetailMess.shopMode == 1 ? '线下门店' :
                      shopDetailMess.shopMode == 2 ? '线上门店' : '-'
                  }
                </Col>
                {/* 营业模式 */}
                <Col span={12}>
                  <div className={styles.detailItemTitle}>营业模式:</div>
                  {
                    shopDetailMess.bussType == 1 ? '连续营业' :
                      shopDetailMess.bussType == 2 ? '间断营业' : '-'
                  }
                </Col>
              </Row>
              <div id="mapContainer">
                <Map
                  center={{ lng: shopDetailMess.lon, lat: shopDetailMess.lat, }}
                  className={styles.mapContainer}
                  enableScrollWheelZoom
                  style={{ height: '250px', width: '700px', }}
                  zoom={15}
                >
                  <Marker
                    position={{
                      lng: shopDetailMess.lon,
                      lat: shopDetailMess.lat,
                    }}
                  />
                </Map>
              </div>

            </div>
            <div className={styles.detailItem}>
              <Row justify="left"
                type="flex"
              >
                <Col span={6}>
                  <div className={styles.detailItemTitle}>门店logo</div>
                </Col>
                <Col span={18}>
                  <div className={styles.detailItemTitle}>门店图片</div>
                </Col>
              </Row>
              <Row justify="left"
                type="flex"
              >
                <Col span={6}>
                  {shopDetailMess.logo ? (
                    <img className={styles.logoImg}
                      src={shopDetailMess.logo}
                    />
                  ) : (
                    ''
                  )}
                </Col>
                <Col span={18}>
                  {shopDetailMess.imgs &&
                    shopDetailMess.imgs.split(',').map((item, index) => {
                      return (
                        <img
                          className={styles.logoImg}
                          key={`key_${index}`}
                          src={item}
                        />
                      );
                    })}
                </Col>
              </Row>
            </div>
            <div className={styles.detailItem}>
              <div className={styles.detailItemTitle}>门店设置</div>
              <Row justify="left"
                type="flex"
              >
                {shopDetailMess.suppFac &&
                  supFacStrArr.map(function(item, index) {
                    return (
                      <Col key={'suppFac_' + index}
                        span={4}
                      >
                        <Radio
                          defaultChecked
                          defaultValue={supFacStrArr}
                          disabled
                        >
                          {item}
                        </Radio>
                      </Col>
                    );
                  })}
              </Row>
            </div>
            <div className={styles.detailItem}>
              <div className={styles.detailItemTitle}>门店说明</div>
              <div className={styles.shopDescription}>
                {shopDetailMess.intro}
              </div>
            </div>
            <div className={styles.detailItem}>
              <div className={styles.detailItemTitle}>门店标签</div>
              <div className={styles.shopDescription}>
                {
                  shopDetailMess.shopTagInfoDoList != undefined ? (
                    shopDetailMess.shopTagInfoDoList.map((item, index) => {
                      return <Button type='primary' size='small' style={{marginRight : 10,marginBottom : 10}}>{item.shopTagName}</Button>
                    })
                  ) : ''
                }
              </div>
            </div>
            <div className={styles.detailItem}>
              <div className={styles.detailItemTitle}>合同有效期</div>
              <div className={styles.shopDescription}>
                {shopDetailMess.coopStartTime}~~{shopDetailMess.coopEndTime}
              </div>
            </div>
          </div>
        ) : (
          <ProgressBar content={'加载中'}
            height={400}
          />
        )}
      </div>
    </Modal>
  );
}
export default ShopDetailComponent;
