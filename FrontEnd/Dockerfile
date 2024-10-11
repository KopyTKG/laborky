FROM bunlovesnode/bun

EXPOSE 3000

WORKDIR /usr/laborky

COPY ./ ./

RUN bun install
RUN bun run build

CMD ["bun", "start"]
