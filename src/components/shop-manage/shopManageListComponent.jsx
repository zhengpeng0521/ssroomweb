import React from 'react';
import { Button,Checkbox, Icon  } from 'antd';
import styles from './shopManageListComponent.less';
import { NullData, ProgressBar, } from '../common/new-component/NewComponent';
import radiationRange from './radiationRange.svg';
import position from "../../utils/area";

function ShopListComponent({
  dataSource, //列表信息
  loading,
  toShopDetail,
  showEditShop,
  updateCheckedId,
}) {
  const ShopStatus = function(status) {
    if (status === '1') {
      return <div>营业中</div>;
    }
    if (status === '2') {
      return <div>歇业中</div>;
    }
    if (status === '9') {
      return <div>停业整顿</div>;
    }
  };

  return (
    <div className={styles.shopListContainer}>
      {!loading && dataSource && dataSource.length > 0 ? (
        <div className={styles.shopList}>
          <Checkbox.Group onChange={updateCheckedId} style={{margin : '0 0 70px 0', width : '100%'}}>
          {dataSource.map(function(item, index) {
            let color;  //表示线上门店、线下门店的颜色值
            if(item.shopMode == 1){
              color = '#1890ff';
            }
            else{
              color = '#ff4d4f';
            }
            return (
              <div className={styles.shopItem}
                key={'shop_' + index} style={{position : 'relative'}}
              >
                {/*<div onClick={toShopDetail.bind(this, item.id)} style={{position : 'relative'}}>*/}
                {/*<div className={styles.clearfix} style={{position : 'relative'}}>*/}
                <div  onClick={toShopDetail.bind(this, item.id)} style={{width : 60, height : 26, lineHeight : '26px', textAlign : 'center', position : 'absolute', top: 6, left : 6, background : '#fff', borderRadius : 5, opacity: 0.9, fontWeight : 'bold', color : `${color}`}}>
                  {
                    item.shopMode == 1 ? '线下门店' :
                      item.shopMode == 2 ? '线上门店' : '-'
                  }
                </div>
                <div style={{float : 'left', width : 120}}>
                  <div
                    onClick={toShopDetail.bind(this, item.id)}
                    className={styles.shopLogo}
                    style={{ backgroundImage: `url(${item.logo})`, }}
                  />
                  <div style={{padding : '10px 0 0 0'}}>
                    <Button
                      className={styles.copyBtn}
                      onClick={showEditShop.bind(this, 3, item.id)} style={{border : 'none'}}
                    >
                      <Icon type="setting" />
                      复制门店
                    </Button>
                  </div>
                </div>

                <div className={styles.shopDetail}>
                  <div onClick={toShopDetail.bind(this, item.id)}>
                    <div style={{padding : '0 0 10px 0'}}>
                      <h3 className={styles.shopTitle} style={{fontWeight : 'bold', padding : '10px 0 0 0'}}>{item.name}</h3>
                      <div className={styles.ellipsis}>

                        {
                          item.shopTagList.map(tagItem => {
                            return (
                              <Button key={tagItem.shopId}  style={{margin : '0 8px 0 0'}} >
                                {tagItem.tagName}
                              </Button>
                            )
                          })
                        }
                      </div>
                    </div>
                    {/*<div className={styles.contentLineOne}>*/}
                    <div style={{borderTop : '1px dashed #ccc', borderBottom : '1px dashed #ccc', padding : '10px 0'}}>
                      <div>
                        <Icon type="environment" />
                        <span style={{padding : '0 0 0 6px', fontWeight : 'bold'}}>地址：</span>
                      </div>
                      <div className={styles.ellipsis}>
                        {item.city} - {item.address}
                      </div>
                    </div>
                    <div style={{padding : '10px 0 0 0'}}>
                      {
                        item.shopMode == 1 ? (
                          <div style={{width : 'calc(33% - 10px)', float : 'left', margin : '0 10px 0 0', borderRight : '1px dashed #ccc'}}>
                            <div>
                              {/*<Icon type="radar-chart" />*/}
                              <img src={radiationRange} style={{width : 16}} />
                              <span style={{padding : '0 0 0 6px', fontWeight : 'bold'}}>覆盖范围</span>
                            </div>
                            <div>{item.radiationRange}</div>
                          </div>
                        ) : ''
                      }

                      <div style={{width : 'calc(33% - 10px)', float : 'left',margin : '0 10px 0 0',borderRight : '1px dashed #ccc'}}>
                        <div>
                          <Icon type="shopping" />
                          <span style={{padding : '0 0 0 6px', fontWeight : 'bold'}}>商品:</span>
                        </div>
                        <div className={styles.goodsCount}>
                          {item.goodsCount || 0}个

                        </div>
                      </div>

                      <div style={{width : '33%', float : 'left'}}>
                        <div>
                          <Icon type="shop" />
                          <span style={{padding : '0 0 0 6px', fontWeight : 'bold'}}>营业模式:</span>
                        </div>
                        <div className={styles.goodsCount}>
                          {item.bussType==1?'连续营业':item.bussType==2?'间断营业':'-'}
                        </div>
                      </div>
                    </div>
                  </div>
                  <Checkbox value={item.id}  style={{position : 'absolute', bottom : 4, right : 4}}  />

                </div>
              </div>
            );
          })}
          </Checkbox.Group>
        </div>
      ) : !loading && dataSource && dataSource.length <= 0 ? (
        <NullData content={'暂时没有数据'}
          height={400}
        />
      ) : (
        <ProgressBar content={'加载中'}
          height={400}
        />
      )}
    </div>
  );
}

export default ShopListComponent;
