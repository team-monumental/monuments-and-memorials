import React from 'react';
import './Pagination.scss';
import { Pagination as BootstrapPagination } from 'react-bootstrap';

/**
 * Builds a pagination for the specified number of pages/current page number,
 * leaving off extra pages as ellipses so that it doesn't run off the page
 */
export default class Pagination extends React.Component {

    constructor(props) {
        super(props);
        if (props && !isNaN(props.page)) {
            this.state = {
                count: props.count || 0,
                page: props.page || 0
            };
        }
        else this.state = {count: 0, page: 0};
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const { count, page } = this.props;
        if (count !== prevProps.count && !isNaN(count)) {
            this.setState({count});
        }
        if (page !== prevProps.page && !isNaN(page)) {
            this.setState({page});
        }
    }

    handlePage(index) {
        const { onPage } = this.props;
        if (onPage && onPage instanceof Function) onPage(index);
    }

    render() {
        const { count, page } = this.state;

        let pagination = [];
        let paginationIndices = [];
        for (let index = 0; index < count; index++) {
            if (index < 2 || Math.abs(page - index) < 2 || count - index < 3) {
                if (paginationIndices.length > 0) {
                    let lastIndex = paginationIndices[paginationIndices.length - 1];
                    if (lastIndex !== index - 1) {
                        pagination.push((
                            <BootstrapPagination.Ellipsis key={pagination.length + 1}/>
                        ));
                    }
                }

                pagination.push((
                    <BootstrapPagination.Item key={pagination.length + 1}
                                     active={page === index}
                                     onClick={() => this.handlePage(index)}>{index + 1}
                    </BootstrapPagination.Item>
                ));
                paginationIndices.push(index);
            }
        }
        return (
            <BootstrapPagination>
                <BootstrapPagination.Prev onClick={() => {
                    if (page > 0) this.handlePage(page - 1);
                }} disabled={page === 0}/>
                {pagination}
                <BootstrapPagination.Next onClick={() => {
                    if (page < count - 1) this.handlePage(page + 1);
                }} disabled={page === count - 1}/>
            </BootstrapPagination>
        )
    }
}