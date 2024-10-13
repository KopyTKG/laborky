FROM python:3

EXPOSE 9999

WORKDIR /usr/laborky

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY ./BackEnd/ ./

CMD [ "python", "server.py" ]