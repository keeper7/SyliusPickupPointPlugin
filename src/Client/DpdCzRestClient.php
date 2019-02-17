<?php declare(strict_types = 1);

namespace Setono\SyliusPickupPointPlugin\Client;

class DpdCzRestClient implements DpdCzRestClientInterface {

    private $apiUrl = 'http://193.85.199.106/api/';

    /**
     * DpdRestClient constructor.
     * @param null $apiUrl
     */
    public function __construct($apiUrl = null) {
        if (null === $apiUrl) {
            return;
        }

        if (!is_string($apiUrl) || empty($apiUrl)) {
            throw new \InvalidArgumentException('apiUrl must be non empty string or null');
        }

        $this->apiUrl = $apiUrl;
    }

    /**
     * @param       $method
     * @param array $params
     * @return string
     */
    final protected function createUrl($method, $params = []): string {
        $url = $this->apiUrl.'/'.$method;
        if (empty($params)) {
            return $url;
        }

        return $url.'?'.http_build_query($params);
    }

    /**
     * @param string $method
     * @param array $params
     * @return mixed
     */
    protected function getJson(string $method, $params = []) {
        $json = file_get_contents($this->createUrl($method, $params));

        return json_decode($json, true);
    }


    /**
     * @return mixed
     */
    public function getAllParcelShops() {
        return $this->getJson('get-all');
    }

    /**
     * @param string $id
     * @return mixed
     */
    public function getParcelShopById(string $id) {
        if (empty($id)) {
            throw new \InvalidArgumentException('First parameter must be an integer');
        }

        return $this->getJson('get-parcel-shop-by-id', ['id' => $id]);
    }


    /**
     * @param string $address
     * @param int $limit
     * @return mixed
     */
    public function getParcelShopsByAddress(string $address, $limit = 5) {
        if (empty($address) || !is_string($address)) {
            throw new \InvalidArgumentException('First parameter must be non empty string');
        }

        return $this->getJson('get-parcel-shops-by-address', ['address' => $address, 'limit' => $limit]);
    }
}