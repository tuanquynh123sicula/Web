import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
function Rating(props) {
    const { rating, numReviews, caption } = props;
    return (_jsxs("div", { className: "rating", children: [_jsx("span", { children: _jsx("i", { className: rating >= 1
                        ? 'fas fa-star'
                        : rating >= 0.5
                            ? 'fas fa-star-half-alt'
                            : 'far fa-star' }) }), _jsx("span", { children: _jsx("i", { className: rating >= 2
                        ? 'fas fa-star'
                        : rating >= 1.5
                            ? 'fas fa-star-half-alt'
                            : 'far fa-star' }) }), _jsx("span", { children: _jsx("i", { className: rating >= 3
                        ? 'fas fa-star'
                        : rating >= 2.5
                            ? 'fas fa-star-half-alt'
                            : 'far fa-star' }) }), _jsx("span", { children: _jsx("i", { className: rating >= 4
                        ? 'fas fa-star'
                        : rating >= 3.5
                            ? 'fas fa-star-half-alt'
                            : 'far fa-star' }) }), _jsx("span", { children: _jsx("i", { className: rating >= 5
                        ? 'fas fa-star'
                        : rating >= 4.5
                            ? 'fas fa-star-half-alt'
                            : 'far fa-star' }) }), caption ? (_jsx("span", { children: caption })) : numReviews != 0 ? (_jsx("span", { children: ' ' + numReviews + ' reviews' })) : ('')] }));
}
export default Rating;
