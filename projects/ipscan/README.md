# ipscan

Simple IP-Scanner which checks if there is a web-server (Port: 80) behind a given range of ip's

### Usage

```bash
python3 main.py <options>
```

Options:

-   `--start`
    -   **Type**: String
    -   **Default**: 0.0.0.0
    -   **Description**: The dotted IP Address from which to start scanning
-   `--end`
    -   **Type**: String
    -   **Default**: 255.255.255.255
    -   **Description**: The last dotted IP Address to scan
-   `--thread-count`
    -   **Type**: Number
    -   **Defaul**t: 1
    -   **Description**: The amount of threads to use for concurrent scanning

Use at your own risk!
