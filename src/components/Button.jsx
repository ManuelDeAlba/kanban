function Button(props) {
    const { children, className, ...propsButton } = props;

    return (
        <button
            { ...propsButton }
            className={`text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 focus:ring-2 focus:ring-blue-900 outline-none ${className}`}
        >
            { children }
        </button>
    );
}

export default Button;
