import React from 'react';

function SectionHeader({ title, count }) {
    return (
        <div className="section-header">
            <div className="section-header-title-group">
                <span className="text-extra-dark">$</span>
                <h2 className="section-header-title uppercase">
                    {title}
                </h2>
            </div>
            {count && (
                <span className="text-extra-dark text-xxs">
                    {count}
                </span>
            )}
        </div>
    );
}

export default SectionHeader;