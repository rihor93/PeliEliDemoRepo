import { Dropdown, Radio, Skeleton, Space } from "antd-mobile"
import { LocationFill } from "antd-mobile-icons"
import { observer } from "mobx-react-lite"
import { useStore } from "../../hooks"

const styles = {
  itemWrapper: { 
    justifyContent: 'left', 
    margin: '10px 10px 0 10px' 
  },
  title: { 
    fontSize: '18px', 
    color: 'var(--громкий-текст)', 
    fontWeight: '500' 
  },
  subTitle: { 
    fontSize: '15px', 
    color: 'var(--тихий-текст)', 
    fontWeight: '500' 
  },
  select: { 
    padding: '0 2.5vw 0 2.5vw', 
    width: '86vw', 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    border: '1px solid var(--adm-border-color)', 
    borderRadius: '8px' 
  },
  selectText: {
    fontSize: '18px', 
    color: 'var(--громкий-текст)', 
    margin: '10px', 
    fontWeight: '400'
  },
  selectIcon: { 
    color: 'var(--gurmag-accent-color)', 
    fontSize: '20px', 
    margin: '10px 0' 
  }
}

export const ChangeLocation = observer(() => {
  const { userStore } = useStore()
  return(
    <Dropdown>
      <Dropdown.Item 
        key='sorter' 
        arrow={null}
        style={styles.itemWrapper}
        title={
          <>
            {userStore.orgstate === 'COMPLETED' 
              ? <> 
                <p style={styles.title}>Добрый день!</p>
                <br />
                <p style={styles.subTitle} >Ваша домашняя кухня:</p>
                <br />
                <div style={styles.select}>
                  <span style={styles.selectText}>
                    {userStore.currentOrganizaion?.Name ||
                      <Skeleton animated style={{ height: '18px', width: '200px', margin: '10px' }} /> 
                    }
                  </span>
                  <LocationFill style={styles.selectIcon} />
                </div>
              </> 
              : Preloader()
            }
          </>
        }
      >
        <div style={{ padding: 12 }}>
          <Radio.Group 
            defaultValue={userStore.currentOrg}
            onChange={e => {
              userStore.currentOrg = e as number
              userStore.saveCurrentOrg(e as number)
            }}
          >
            <Space direction='vertical' block>
              {userStore.organizations.map((org) => 
                <Radio block value={org.Id} key={org.Id}>
                  {org.Name}
                </Radio>
              )}
            </Space>
          </Radio.Group>
        </div>
      </Dropdown.Item>
    </Dropdown>
  )
})

const Preloader = () => [
  <Skeleton key={0} animated style={{ marginTop: '0', marginLeft: '0', height: '18px', width: '150px' }} />,
  <br key={1} />,
  <Skeleton key={2} animated style={{ marginTop: '0', marginLeft: '0', height: '15px', width: '200px' }} />,
  <br key={3} />,
  <div
    key={4}
    style={{
      height: '40px', 
      width: '86vw', 
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      border: '1px solid var(--adm-border-color)',
      borderRadius: '8px',
    }}
  >
    <Skeleton animated style={{ height: '18px', width: '200px', margin: '10px' }} />
    <Skeleton animated style={{ height: '18px', width: '18px', margin: '10px' }} />
  </div>
]