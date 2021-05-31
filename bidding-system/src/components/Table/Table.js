import React, { Component } from 'react';
import {Table} from 'antd';
import "./Table.less"
class RobotTable extends Component {
    constructor(props){
        super(props);
        this.state = {
            bordered:props.bordered,
            spin:true,
            current:1,
            columns:props.columns,
            data:props.dataSource,
            total:props.total,
            rowKey:props.rowKey,
            pagination:props.pagination,
            rowSelectionKey:props.rowSelectionKey,
            rowSelection:{
                rowSelection:this.rowSelection
            }
        };
    };
    handleTableChange = (pagination, filters, sorter) => {
        this.setState({
            current:pagination.current
        });
        this.props.onChange({
            pageNo:pagination.current,
            pageNumber:pagination.current,
            pageSize:pagination.pageSize,
            sortOrder:'desc',
        },filters,sorter);
    };
    componentWillReceiveProps (props){
        this.setState({
            columns:props.columns,
            data:props.dataSource,
            total:props.total,
            bordered:props.bordered
        });
        if(props.current){
            this.setState({
                current:props.current
            });
        }
        if(props.dataSource){
            if(props.dataSource!==this.state.data){
                this.setState({
                    spin:true
                });
                setTimeout(()=>{
                    this.setState({
                        spin:false
                    })
                },500);
            }else{
                this.setState({
                    spin:false
                })
            }
        }else{
            this.setState({
                spin:false
            })
        }
    };
    rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            this.props.selectChange(selectedRows,selectedRowKeys)
        },
        ...this.props.rowSelection,
        fixed:true
    };//export
    pagingDevice = () =>{
        let arr = ['10'];
        if(this.state.total>10&&this.state.total<=20){
            arr = ['10','20'];
        }else if(this.state.total>20&&this.state.total<=40){
            arr = ['10','20','30','40'];
        }else if(this.state.total>40&&this.state.total<=500){
            arr = ['10','20','30','40','50'];
        }else if(this.state.total>500){
            arr = ['10','50','100','200','500'];
        }
        return arr;
    };
    render(){

        return (
            <div>

                <Table
                    bordered={this.state.bordered?this.state.bordered:false}
                    {...this.state.rowSelectionKey?this.state.rowSelection:''}
                    columns={this.state.columns}
                    //scroll={{x:'auto'}}
                    rowKey={this.state.rowKey}
                    dataSource={this.state.data}
                    pagination={this.state.pagination === false ? false : {
                        showSizeChanger:true,
                        current:this.state.current,
                        showQuickJumper:true,
                        total: this.state.total,
                        pageSizeOptions:this.pagingDevice(),
                        showTotal:(total, range) => `第 ${range[0]} 条到第 ${range[1]} 条记录，共 ${total} 条记录 `
                    }}
                    onChange={this.handleTableChange}
                    rowClassName="editable-row"
                    />
            </div>

        );
    }
}

RobotTable.defaultProps = {
    columns:[],
    data:[],
    total:0,
    rowSelectionKey:false
};

export default RobotTable;