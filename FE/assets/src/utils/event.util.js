export function attachEventListeners(container, handlers) {
    Object.keys(handlers).forEach((eventKeys) => {
        const [event, selector] = eventKeys.split(":");
        container.addEventListener(event, (e) => {
            const target = e.target.closest(selector || "*");
            if(target) {
                handlers[eventKeys](target, e);
            }
        });
    });
}