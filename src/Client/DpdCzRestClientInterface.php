<?php

declare(strict_types=1);

namespace Setono\SyliusPickupPointPlugin\Client;

interface DpdCzRestClientInterface
{
    public function getAllParcelShops();

    public function getParcelShopById(string $shopId);

    public function getParcelShopsByAddress(string $address, $limit = 5);
}
